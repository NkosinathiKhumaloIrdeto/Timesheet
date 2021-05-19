var homeContr = function ($scope, $state, $http, $cookies) {

    $scope.enableCalandar = false;
    $scope.activeLink = 1;
    $scope.obj = { username: {username:""} };

    $scope.db = {
        users: [
        ]
    } 

    $scope.displayCal = function () {

        $cookies.put('timesheetUser', $scope.obj.username.username);

        $scope.enableCalandar = true;

        $('.login-div').hide();

        $state.go("home.calendar", { username: $scope.obj.username.username })
    }

    $scope.logout = function(){

        $cookies.remove('timesheetUser');

        console.log("logged out");

        console.log($cookies.get('timesheetUser'));


        location.reload();

        return;
        $state.go("home")

        $scope.enableCalandar = false;

        $('.login-div').show();
    }

    //check cookies 
    var username = $cookies.get('timesheetUser');

    if (username != null){
        
        $scope.obj.username.username = username
        console.log("user:", $scope.obj.username.username)
        $scope.enableCalandar = true;

        $('.login-div').hide(); 

        $state.go("home.calendar", { username: $scope.obj.username.username })
        
        return;
    }
  
    //load usernames
    $http.get("/users/getUsers")
    .then((res)=>{
        $scope.db.users = res.data;
    })

}