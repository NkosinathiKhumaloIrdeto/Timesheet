angular.module('app', ['login-app', 'ui.router'])
    .filter('getInitials', function () {

        // In the return function, we must pass in a single parameter which will be the data we will work on.
        // We have the ability to support multiple other parameters that can be passed into the filter optionally
        return function (name) {

            var split_name = name.split(" ");

            var output;

            output = split_name[0].slice(0, 1)
            output = output + split_name[1].slice(0, 1)

            return output;

        }

    })
    .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('home', {
                name: 'home',
                url: '/home',
                controllerAs: "homeCtr",
                templateUrl: "js/home/home.html",
                controller: homeContr,
            })

            .state('home.calendar', {
                name: 'calendar',
                controller: calendarContr,
                templateUrl: 'js/home/calendar/calendar.html',
                params: {username:null}
                
            })
            .state('home.reports', {
                name: 'reports',
                controller:reportCtr,
                templateUrl: 'js/home/report/report.html',
                params: {username:null}
                
            })

        $urlRouterProvider.otherwise('/home');
    })
    .filter('dateOnly', function () {
        return (strDate) => {
            return strDate.split("T")[0]
        }
    }).
    filter('dayOfTheWeek', function () {
        return (strDate) => {
            return getDayOfTheWeek(new Date(strDate))
        }
    })//weekAndDay
    .filter('weekAndDay', function () {
        return (strDate) => {
            return weekAndDay(new Date(strDate))
        }
    })


    