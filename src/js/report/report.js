angular.module('report-app', [])
    .controller('report-contr', function ($http, $scope, $window) {


        $scope.uiObj = {
            userSelectd: false,
            username: '',
            fromDate: '',
            toDate: '',
            btnText: "Go!",
            
        }

        $scope.uiForm = {}

        $scope.reportingObj = {
            totalNormal: 0
        }
        var currentObjs = [];
        var strDateStart = "";


        function determineWorkType(object, strType, hours) {
            var decHours = timeToDecimal(hours);
            switch (strType) {
                case "LEAVE":
                    object.LEAVE += decHours
                    break;
                case "NORMAL":
                    object.NORMAL += decHours
                    break;
                case "OTHER":
                    object.OTHER += decHours
                    break;
                case "OVERTIME":
                    object.OVERTIME += decHours
                    break;
                case "SPECIAL":
                    object.SPECIAL += decHours
                    break;
            }

            object.TOTAL += decHours
            $scope.reportingObj.totalNormal += decHours
            return object;

        }
        function timeToDecimal(t) {
            var arr = t.split(':');
            return parseFloat(parseInt(arr[0], 10) + '.' + parseInt((arr[1] / 6) * 10, 10));
        }
        $scope.displayReport = function () {

            if ($scope.uiObj.username.length == 0) {

                alert('Please Select Name');

                return;

            }

            //get user details
            $http.get('/data/getUser/' + $scope.uiObj.username)
                .then((response) => {
                    //console.log(response.data);
                    $scope.uiForm = response.data
                }, (err) => { console.log(err) })

            //

            //  $window.print();

            $scope.uiObj.userSelectd = true;

        }


        $scope.genReport = function () {

            if ($scope.uiObj.btnText == "Clear") {
                strDateStart = '';
                currentObjs = [];
                $scope.uiObj.reportData = [];
                $scope.uiObj.btnText = "Go!"
                $scope.reportingObj.totalNormal = 0
                return;
            }

            var from, to;

            from = $scope.uiObj.fromDate;

            to = $scope.uiObj.toDate;

            $http.get('/data/getBy/' + from + "/" + to)

                .then((response) => {

                    for (var i = 0; i < response.data.length; i++) {

                        var obj = response.data[i];

                        if (strDateStart !== obj.start.split("T")[0]) {

                            strDateStart = obj.start.split("T")[0];

                            obj.LEAVE = 0;
                            obj.NORMAL = 0;
                            obj.OVERTIME = 0;
                            obj.OTHER = 0;
                            obj.SPECIAL = 0;
                            obj.TOTAL = 0;

                            currentObjs.push(obj);

                            currentObjs[currentObjs.length - 1] = determineWorkType(obj, obj.worktype, obj.hours)

                        }
                        else {

                            var updatedObj = determineWorkType(currentObjs[currentObjs.length - 1], obj.worktype, obj.hours)

                            currentObjs[currentObjs.length - 1] = updatedObj

                        }

                    }

                    $scope.uiObj.reportData = currentObjs;

                    $scope.uiObj.btnText = "Clear";

                }, (err) => {

                    console.log('error', err)

                })

        }

    })
    .filter('dateOnly', function () {
        return (strDate) => {
            return strDate.split("T")[0]
        }
    })
