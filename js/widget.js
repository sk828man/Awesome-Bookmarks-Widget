function viewCtrl($scope) {

  $scope.tree = null;
  $scope.view = null;
  $scope.path = [0];
  $scope.crumbs = [];

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
  };


  $scope.changeView = function(view, up) {
    if ( up && view < $scope.path.length ) {
      $scope.path.pop();
      return $scope.changeView(view, up);
    } else {
      $scope.path.push(view);
    }

    $scope.crumbs = [];
    $scope.getView($scope.tree, $scope.path);
  };

  $scope.getHostname = function(url) {
    return $("<a href='" + url + "'></a>")[0].hostname;
  };

  chrome.extension.sendMessage({type: "bookmarkTree"}, $scope.update);

}

function removeElements(array, index) {
  var tempArray = new Array();
  var counter = 0;

  for(var i = 0; i < array.length; i++) {
    if(i != index) {
      tempArray[counter] = array[i];
      counter++;
    }
  }
  return tempArray;
}
