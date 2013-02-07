function viewCtrl($scope) {

  $scope.tree = null;
  $scope.view = null;
  $scope.path = [0];
  $scope.favorite = null;
  $scope.crumbs = [];
  $scope.favoriteActive = "";

  $scope.loadFavorite = function(tree) {
    chrome.storage.sync.get(GUID, function(data) {
      if ( typeof data[GUID] === "undefined" ) {
        $scope.favorite = [0, 0];
        $scope.path = [0, 0];
      } else {
        $scope.favorite = JSON.parse(JSON.stringify(data[GUID].favorite)) || [0, 0];
        $scope.path = JSON.parse(JSON.stringify(data[GUID].favorite)) || [0, 0];
      }

      $scope.update(tree);
    });
  };

  $scope.update = function(tree) {
    $scope.tree = tree;
    $scope.crumbs = [];
    $scope.getView($scope.tree, $scope.path);
    $scope.$apply();
  };

  $scope.getView = function(view, array) {
    if ( array.length > 0 ) {
      $scope.crumbs.push(view[array[0]].title);
      view = view[array[0]].children;
      array = removeElements(array, 0);
      return $scope.getView(view, array);
    }

    $scope.view = view;
    setTimeout($scope.crumbHeight, 100);

    $scope.favoriteActive = ($scope.path.join() === $scope.favorite.join()) ? "active" : "";
  };

  $scope.changeView = function(view, up, last) {
    if ( last )
      return;

    if ( up && view + 1 < $scope.path.length ) {
      $scope.path.pop();
      return $scope.changeView(view, up);
    } else if ( !up ) {
      $scope.path.push(view);
    }

    $scope.crumbs = [];
    $scope.getView($scope.tree, $scope.path);
  };

  $scope.crumbHeight = function() {
    $("#bookmarks").css("padding-top", $("#crumbs").height());
  };
  $(window).bind("resize", $scope.crumbHeight);

  $scope.saveFavorite = function() {
    var toSave = {};
    toSave[GUID] = { favorite: $scope.path };
    chrome.storage.sync.set(toSave);
    $scope.favoriteActive = "active";
  };

  $scope.getHostname = function(url) {
    return $("<a href='" + url + "'></a>")[0].hostname;
  };

  chrome.extension.sendMessage({type: "bookmarkTree"}, $scope.loadFavorite);
}

function removeElements(array, index) {
  var tempArray = new Array();
  var counter = 0;

  for (var i = 0; i < array.length; i++) {
    if (i != index) {
      tempArray[counter] = array[i];
      counter++;
    }
  }
  return tempArray;
}

function get_guid() {
  try {
    if ( window.location.hash ) {
      return JSON.parse( decodeURIComponent(window.location.hash).substring(1) ).id;
    } else {
      return "default";
    }
  } catch(e) {
    return "default";
  }
}
GUID = get_guid();
