angular.module('login-app', [])
    .directive('loginDiv', function () {
        return {
            restrict: 'E',
            controllerAs: "loginContr",
            templateUrl: 'js/login/login.html',
            scope: '=',
            controller: function ($scope) {

                this.proceed = function () {
                    displayCal();
                }

            }
        }
    }

    )