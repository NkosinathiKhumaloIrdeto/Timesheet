angular.module('app', ['login-app', 'ui.router'])
    .filter('getInitials', function () {

        // In the return function, we must pass in a single parameter which will be the data we will work on.
        // We have the ability to support multiple other parameters that can be passed into the filter optionally
        return function (name) {
            
            console.log(name);

            var output;

            if(name.indexOf(" ") > 0){

                console.log("1");

                var split_name = name.split(" ");

                output = split_name[0].slice(0, 1);

                output = output + split_name[1].slice(0, 1);

            } else 

            { 
                console.log("2");

                output = (name.charAt(0) + "" + name.charAt(1)).toLocaleUpperCase();

            }

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
                controllerAs: "calController",
                templateUrl: 'js/home/calendar/calendar.html',
                params: { username: null }

            })
            .state('home.reports', {
                name: 'reports',
                controller: reportCtr,
                templateUrl: 'js/home/report/report.html',
                params: { username: null }

            }) //
            .state('home.info', {
                name: 'info',
                controller: infoCtr,
                templateUrl: 'js/home/info/info.html',
                params: { username: null }

            })
            .state('home.settings', {
                name: 'settings',
                controller: settingsCtr,
                templateUrl: 'js/home/settings/settings.html',
                params: { username: null }

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


