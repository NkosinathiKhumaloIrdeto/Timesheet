var homeContr = function ($scope, $state) {

    $scope.enableCalandar = false;
    $scope.activeLink = 1;
    $scope.obj = { username: "" };

    $scope.displayCal = function () {
        $scope.enableCalandar = true;
        $('.login-div').hide();   
        $state.go("home.calendar", {username:$scope.obj.username})      
    }


}