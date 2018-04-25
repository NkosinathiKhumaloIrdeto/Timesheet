angular.module('app', [])
    .controller('contr', function ($scope, $http) {

        setUpCal();

        function clearFields() {
            $scope.uiObj = {
                worktype: "",
                employee: "",
                category: "",
                start: "",
                end: "",
                hours: "",
                title: "",
                projectname: ""
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
            projectname: ""
        }

        $scope.saveEvent = function () {

            $scope.uiObj.title = $('#txtDescription').val();
            $scope.uiObj.category = $('#selectCategory').val();
            $scope.uiObj.worktype = $('#selectWorkType').val();
            $scope.uiObj.projectname = $('#selectProjectName').val();
            $scope.uiObj.hours = getHours($scope.uiObj.end, $scope.uiObj.start);

            //send data to server
            $http.post('/data/log', $scope.uiObj)
                .then((response) => {

                    $('#calendar').fullCalendar('renderEvent', $scope.uiObj);
                    $('#exampleModal').modal('toggle')
                    $('#txtDescription').val('')

                    clearFields();

                    console.log('success', response);

                }, (error) => {
                    console.log(error)
                })

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

            $('#exampleModalLabel').html("New Entry: " + stDate[0] + "<br>" + stDate[1] + " to " + enDate[1]);

            $('#exampleModal').modal('toggle')

        }

        function setUpCal() {

            $(document).ready(function () {

                var data = returData();

                //save button click
                $("#btn-save-entry").click(function () {

                    dataEntry.title = $('#txtDescription').val()

                    $('#calendar').fullCalendar('renderEvent', dataEntry);
                    $('#exampleModal').modal('toggle')
                    $('#txtDescription').val('')

                })

                var dataEntry = {
                }

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
                    select: function (startDate, endDate) {
                        onSelect(startDate, endDate);

                        //console.log($('textarea#txtDescription').val());


                        /*$('#calendar').fullCalendar('renderEvent', {
                            title: 'dynamic event',
                            start: startDate.format(),
                            end: endDate.format()
                        });*/


                        //    $('#exampleModalLabel').html("New Entry: " + stDate[0] + "<br>" + stDate[1] + " to " + enDate[1]);

                        //  $('#exampleModal').modal('toggle')
                    },
                    events: '/data/getAll',
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
                    }
                });

                function currentDate() {



                }

                function returData() {
                    return []

                }

            });


        }

    })