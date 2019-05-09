var dashboardCtr = function ($scope, $http, $state) {

    //$scope.obj = { username: $state.params.username };
    console.log("working");
    $scope.uiObj = {
        userSelectd: false,
        username: $state.params.username,
        fromDate: '',
        toDate: '',
        btnText: "Go!",
        includeLeave: false,
        filterBy: ""
    }

    $scope.uiForm = {}

    $scope.dashboardObj = {
        users: []
    }

    var currentObjs = [];

    var strDateStart = "";

    var queryDate = new Date();
    queryDate.setDate(25);

    var qDate1 = new Date(queryDate.setMonth(queryDate.getMonth() - 1)); //get previous month
    
    var qDate2 = new Date (queryDate.setMonth(queryDate.getMonth() + 1)); //get previous month
    
var dataXAaxis = [];
var dataYAaxis = [];

    $http.get("/data/getAllBy" + "/" + qDate1 + "/" + qDate2)
        .then((res) => {

            var d = res.data;
            var employeeName = '';

            for (var i = 0; i < res.data.length; i++) {

                employeeName = d[i].employee;

                if (!dataXAaxis.includes(employeeName)) {

                    dataXAaxis.push((employeeName));
                    dataYAaxis.push(parseFloat(d[i].hours));
                    
                } else {
                    
                    dataYAaxis[dataXAaxis.indexOf((employeeName))] += parseFloat(d[i].hours)

                }

            }

            console.log("1",dataYAaxis);
            console.log("2",dataXAaxis);

            loadGraph1();

        })

    function getInitial(name) {

        var output;

        if (name.indexOf(" ") > 0) {

            var split_name = name.split(" ");

            output = split_name[0].slice(0, 1);

            output = output + split_name[1].slice(0, 1);

        } else {

            output = (name.charAt(0) + "" + name.charAt(1)).toLocaleUpperCase();

        }

        return output;

    }

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
            case "SICK":
                object.SICK += decHours
                break;
            case "SPECIAL":
                object.SPECIAL += decHours
                break;
            default:

                break;
        }

        if ((strType == 'LEAVE' || strType == 'SICK' || strType == 'SPECIAL' || strType == 'OTHER')) {
            object.dspClass = "tr-gray";
            if ($scope.uiObj.includeLeave) {
                console.log("strType -", decHours)
                $scope.dashboardObj.totalNormal += decHours
            }
            console.log("strType -", decHours)

        } else {
            object.dspClass = "";
            $scope.dashboardObj.totalNormal += decHours
        }

        object.TOTAL += decHours

        return object;

    }

    function loadGraph1() {
        
        var options = {
            chart: {
                type: 'line'
            },
            series: [{
                name: 'Employee Names',
                data: dataYAaxis
            }],
            xaxis: {
                categories: dataXAaxis
            }
        }

        var chart = new ApexCharts(document.querySelector("#chart"), options);

        chart.render();
    }

    function timeToDecimal(t) {

        var arr = t.split(':');
        //console.log("in-->",t);
        //console.log("out",parseFloat(parseInt(arr[0], 10) + '.' + parseInt((arr[1] / 6) * 10, 10)))
        return parseFloat(parseFloat(arr[0], 10) + '.' + parseFloat((arr[1] / 6) * 10, 10));
    }

    $scope.exportCSV = function () {

        var from, to;

        from = $scope.uiObj.fromDate;

        to = $scope.uiObj.toDate;

        $('#first').css("display", "block");

        $http.get('/data/exportCSV/' + from + "/" + to + "/" + $state.params.username)
            .then((res) => {
                $('#first').css("display", "none");
                var anchor = angular.element('<a/>');
                anchor.css({ display: 'none' }); // Make sure it's not visible
                angular.element(document.body).append(anchor); // Attach to document

                anchor.attr({
                    href: 'data:attachment/csv;charset=utf-8,' + encodeURI(res.data),
                    target: '_blank',
                    download: $scope.uiObj.username + ".csv"
                })[0].click();

                anchor.remove();

            }, (err) => {
                console.log('exportCSV', err)
            })

    }

    $scope.displayReport = function () {

        if ($scope.uiObj.username.length == 0) {

            alert('Please Select Name');

            return;

        }

        //get user details
        $http.get('/data/getUser/' + $state.params.username)
            .then((response) => {
                $scope.uiForm = response.data
            }, (err) => { console.log(err) })


        $scope.uiObj.userSelectd = true;
    }

    function setusername() {

        if ($scope.obj.username == null) {
            $scope.obj.username = $state.params.username;
        }

        return $scope.obj.username;

    }

    $scope.genReport = function () {

        if ($scope.uiObj.btnText == "Clear") {
            strDateStart = '';
            currentObjs = [];
            $scope.uiObj.reportData = [];
            $scope.uiObj.btnText = "Go!"
            $scope.dashboardObj.totalNormal = 0
            return;
        }

        var from, to, filter;

        from = $scope.uiObj.fromDate;

        to = $scope.uiObj.toDate;



        if ($scope.uiObj.filterBy.length == 0) {
            filter = "";
        } else {
            filter = $scope.uiObj.filterBy;
        }

        $('#first').css("display", "block");

        $http.get('/data/getBy/' + from + "/" + to + "/" + $state.params.username + "?filterBy=" + filter)

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
                        obj.SICK = 0;

                        currentObjs.push(obj);

                        currentObjs[currentObjs.length - 1] = determineWorkType(obj, obj.worktype, obj.hours)

                    }
                    else {



                        var updatedObj = determineWorkType(currentObjs[currentObjs.length - 1], obj.worktype, obj.hours)

                        currentObjs[currentObjs.length - 1] = updatedObj

                    }


                }

                $('#first').css("display", "none");
                $scope.uiObj.reportData = currentObjs;

                $scope.uiObj.btnText = "Clear";

            }, (err) => {

                console.log('error', err)

            })



    }
}