var homeContr = function ($scope, $http, $state) {
    $scope.enableCalandar = false;
    $scope.obj = { username: "" };

    $scope.displayCal = function () {
        $scope.enableCalandar = true;
        $('.login-div').hide();   
        $state.go("home.calendar", {username:$scope.obj.username})    
    }

}