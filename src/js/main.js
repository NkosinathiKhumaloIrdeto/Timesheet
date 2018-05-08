angular.module('app', ['login-app'])
    .controller('contr', function ($scope, $http, $window) {


        $scope.enableCalandar = false;

        $scope.obj = { username: "" };
        var url = "/data/getAll";
        var queryUrl = "";
        $scope.displayCal = function () {
            queryUrl = url + "/" + $scope.obj.username
            $scope.enableCalandar = true;
            setUpCal();
        }

        $scope.action

        $scope.txtDescription = "";

        function clearFields() {
            $scope.uiObj = {
                worktype: "",
                employee: $scope.obj.username,
                category: "",
                start: "",
                end: "",
                hours: "",
                title: "",
                projectname: "",
                startDate:'',
                endDate:''
            }
        }

        $scope.uiObj = {
            worktype: "",
            employee: "",
            category: "",
            start: "",
            end: "",
            hours: "",
            title: "",
            projectname: "",
            startDate:'',
            endDate:''
        }

        $scope.saveEvent = function () {

            if ($scope.txtDescription.length == 0) {
                alert("Please add description");
                return;
            }

            $scope.uiObj.employee = $scope.obj.username;
            $scope.uiObj.title = $('#txtDescription').val();
            $scope.uiObj.category = $('#selectCategory').val();
            $scope.uiObj.worktype = $('#selectWorkType').val();
            $scope.uiObj.projectname = $('#selectProjectName').val();
            $scope.uiObj.hours = timeToDecimal(getHours($scope.uiObj.end, $scope.uiObj.start));

            //send data to server
            $http.post('/data/log', $scope.uiObj)
                .then((response) => {

                    $('#calendar').fullCalendar('renderEvent', $scope.uiObj);
                    $('#exampleModal').modal('hide')
                    $('#txtDescription').val('')

                    clearFields();

                    //   console.log('success', response);

                }, (error) => {
                    console.log(error)
                })

        }

     /*   function updateEvent() {

            $http.post('/data/updateLog', $scope.uiObj)
                .then((response) => {

                }, (error) => {
                    console.log(error)
                })
        }*/

        $scope.genReport = function(){
            $window.open('/Report/Report.html', '_blank');
        }

        function getHours(newDate, oldDate) {
            var ms = moment(new Date(newDate), "DD/MM/YYYY HH:mm:ss").diff(moment(new Date(oldDate), "DD/MM/YYYY HH:mm:ss"));
            var d = moment.duration(ms);
            var s = Math.floor(d.asHours()) + moment.utc(ms).format(":mm:ss");

            return s;
        }

        function onSelect(startDate, endDate) {

            var stDate = startDate.format().split("T");
            var enDate = endDate.format().split("T");

            $scope.uiObj.start = startDate.format()
            $scope.uiObj.end = endDate.format()
            $scope.uiObj.startDate = startDate.format()
            $scope.uiObj.endDate = endDate.format()

            $('#exampleModalLabel').html("New Entry: " + stDate[0] + "<br>" + stDate[1] + " to " + enDate[1]);

            $('#exampleModal').modal('toggle')

        }

        function timeToDecimal(t) {

            var arr = t.split(':');

            return parseFloat(parseInt(arr[0], 10) + '.' + parseInt((arr[1] / 6) * 10, 10));
        }

        function setUpCal() {

            $(document).ready(function () {

                //save button click
                $("#btn-save-entry").click(function () {

                    dataEntry.title = $('#txtDescription').val()

                    $('#calendar').fullCalendar('renderEvent', dataEntry);
                    $('#exampleModal').modal('show')
                    $('#txtDescription').val('')

                })
                
                $('#calendar').fullCalendar({
                    header: {
                        left: 'prev,next today',
                        center: 'title',
                        right: 'month,agendaWeek,agendaDay,listWeek'
                    },
                    defaultDate: moment(new Date()),
                    defaultView: 'agendaWeek',
                    navLinks: true, // can click day/week names to navigate views
                    editable: true,
                    eventLimit: true, // allow "more" link when too many events
                    selectable: true, //Allows a user to highlight multiple days or timeslots by clicking and dragging.
                    eventResize: function (event, delta, revertFunc, jsEvent, ui, view) {

                        var startDate = event.start.format();
                        var endDate = event.end.format();
                        
                        $scope.uiObj.end = event.end.format();
                        $scope.uiObj.end = event.end.format();
                        $scope.uiObj._id = event._id;
                        console.log("-->",$scope.uiObj);   
                        $scope.uiObj.hours = timeToDecimal(getHours(endDate, startDate));
                        
                        $http.post('/data/updateLog', $scope.uiObj)
                        .then((response) => { 
                            delete $scope.uiObj._id
                        }, (error) => {
                            delete $scope.uiObj._id
                            console.log(error)
                        })

                    },
                    select: function (startDate, endDate) {
                        onSelect(startDate, endDate);                      
                    },
                    events: queryUrl,
                    eventClick: function (calEvent, jsEvent, view) {

                        /*                   alert('Event: ' + calEvent.title);
                                  alert('Coordinates: ' + jsEvent.pageX + ',' + jsEvent.pageY);
                                  alert('View: ' + view.name);
                        */
                        ///                  $('#exampleModal').on('shown.bs.modal', function () {
                        //$('#myInput').trigger('focus')
                        //                    })

                        //    $('#exampleModalLabel').html(calEvent.title);
                        //   $('#exampleModal').modal('toggle')
                       // console.log('event click', calEvent._id)
                    }
                });

                function apiCall(strUrl, objData) {

                    var request = $http.post(strUrl, objData);

                    return request.then((response) => {

                        return response;

                    }, (error) => {
                        return error;
                    })

                }

                $scope.enableCalandar = true;

            });


        }

    })