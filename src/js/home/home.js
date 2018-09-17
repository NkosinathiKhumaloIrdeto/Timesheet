var homeContr = function ($scope, $state, $http) {

    $scope.enableCalandar = false;
    $scope.activeLink = 1;
    $scope.obj = { username: "" };

    $scope.db = {
        users: [
        ]
    } 

    //load usernames
    $http.get("/users/getUsers")
    .then((res)=>{
        $scope.db.users = res.data;
    })

    //$scope.obj = { users: [] }

    //load users from db
    /*$http.get('/users/getUsers')
        .then((res) => {
            
            $scope.obj.users = res.data;
console.log(res.data);
        }, (err) => {

        })
*/
    $scope.displayCal = function () {

        $scope.enableCalandar = true;
        

        $('.login-div').hide();
        $state.go("home.calendar", { username: $scope.obj.username.username })
    }


}