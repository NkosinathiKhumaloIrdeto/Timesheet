var calendarContr = function ($scope, $http, $state) {

    $scope.obj = { username: $state.params.username };

    var url = "/data/getAll";
    var queryUrl = "";
    var queryUrl = url + "/" + $scope.obj.username
    let updateObj = {
        updateData: {},
        eventObj: {}
    }

    $('#msgSuccess').hide();
    $('#msgError').hide();

    $('.sidenav-menu').show();

    $scope.msg = {
        error: "",
        errorTitle: "",
        success: "",
        successTitle: ""
    }

    var dataEntry = {}

    $scope.saveActions = "SaveNew"

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
            startDate: '',
            endDate: ''
        }

        updateObj = {
            updateData: {},
            eventObj: {}
        }

        $('#txtDescription').val('');
        $('#selectCategory').val('');
        $('#selectWorkType').val('');
        $('#selectProjectName').val('');

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
        startDate: '',
        endDate: ''
    }

    //<--- enable calendar here --->
    setUpCal();

    $scope.actionEvent = function () {

        switch ($scope.saveActions) {
            case "SaveNew":
                saveEvent();
                break;

            case "SaveUpdate":
                processEventUpdate();
                break;

            default:
                alert("An Error has occurred. Please contact admin. log: #actionEvent()")
                break;
        }

    }

    function saveEvent() {

        if ($scope.txtDescription.length == 0) {

            alert("Please add description");

            return;
        }

        $('#first').css("display", "block");

        $scope.uiObj.employee = $scope.obj.username;
        $scope.uiObj.title = $('#txtDescription').val();
        $scope.uiObj.category = $('#selectCategory').val();
        $scope.uiObj.worktype = $('#selectWorkType').val();
        $scope.uiObj.projectname = $('#selectProjectName').val();
        $scope.uiObj.hours = timeToDecimal(getHours($scope.uiObj.end, $scope.uiObj.start));

        //send data to server
        $http.post('/data/log', $scope.uiObj)
            .then((response) => {

                $scope.uiObj.id = response.data.id;
                console.log($scope.uiObj);

                $('#calendar').fullCalendar('renderEvent', $scope.uiObj);
                $('#exampleModal').modal('hide')
                $('#txtDescription').val('')
                $scope.msg = {
                    error: "",
                    success: ""
                }

                showSnack($scope.uiObj.title + ": " + response.data.message);
                //  flagMessage($scope.uiObj.title, response.data.message, 1);

                clearFields();
                $('#first').css("display", "none");

            }, (error) => {
                flagMessage("Error: ", error, 0);
                $('#first').css("display", "none");
            })

    }

    function flagMessage(strTitle, strMessage, type) {

        $('#msgSuccess').hide();
        $('#msgError').hide();

        if (type == 1) {
            $scope.msg.successTitle = strTitle;
            $scope.msg.success = strMessage;
            $('#msgSuccess').show();
            $('#msgSuccess').delay(5000).fadeOut("slow")
        } else {
            $scope.msg.errorTitle = strTitle;
            $scope.msg.error = strMessage;
            $('#msgSuccess').show();
            $('#msgSuccess').delay(5000).fadeOut("slow")
        }

    }



    function getHours(newDate, oldDate) {
        var ms = moment(new Date(newDate), "DD/MM/YYYY HH:mm:ss").diff(moment(new Date(oldDate), "DD/MM/YYYY HH:mm:ss"));
        var d = moment.duration(ms);
        var s = Math.floor(d.asHours()) + moment.utc(ms).format(":mm:ss");

        return s;
    }
    //showSnack("Hellow World");
    //#first
    function onSelect(startDate, endDate) {
        clearFields();

        var stDate = startDate.format().split("T");
        var enDate = endDate.format().split("T");

        $scope.uiObj.start = startDate.format()
        $scope.uiObj.end = endDate.format()
        $scope.uiObj.startDate = startDate.format()
        $scope.uiObj.endDate = endDate.format()

        $('#exampleModalLabel').html("New Entry: " + stDate[0] + "<br>" + stDate[1] + " to " + enDate[1]);

        $('#exampleModal').modal('show')

    }

    function timeToDecimal(t) {

        var arr = t.split(':');

        return parseFloat(parseInt(arr[0], 10) + '.' + parseInt((arr[1] / 6) * 10, 10));
    }

    function processEventUpdate() {

        updateObj.updateData.title = $('#txtDescription').val(),
            updateObj.updateData.category = $('#selectCategory').val(),
            updateObj.updateData.worktype = $('#selectWorkType').val(),
            updateObj.updateData.projectname = $('#selectProjectName').val(),

            $('#first').css("display", "block");

        $http.post('/data/updateLogDetail', updateObj.updateData)
            .then((res) => {

                updateObj.eventObj.title = updateObj.updateData.title

                $('#calendar').fullCalendar('updateEvent', updateObj.eventObj);
                $('#first').css("display", "none");

                showSnack(updateObj.updateData.title + ": " + res.data.message);

                $('#exampleModal').modal('hide');

                clearFields();

            }, (err) => {
                flagMessage("Error: ", err, 0);
                console.log(err)
            })

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

                    $scope.uiObj.end = endDate;
                    $scope.uiObj.endDate = event.end;

                    console.log(event);

                    if (event._id.length < 6) {
                        $scope.uiObj._id = event.id;
                    } else {
                        $scope.uiObj._id = event._id;
                    }


                    $scope.uiObj.hours = timeToDecimal(getHours(endDate, startDate));

                    $('#first').css("display", "block");
                    $http.post('/data/updateLogResize', $scope.uiObj)
                        .then((response) => {

                            $('#first').css("display", "none");
                            showSnack("Updated: " + response.data.message);
                        }, (error) => {
                            delete $scope.uiObj._id
                            flagMessage("Error:", error, 0);
                            console.log(error)
                        })

                },
                select: function (startDate, endDate) {

                    $scope.saveActions = "SaveNew"

                    onSelect(startDate, endDate);

                },
                events: queryUrl,
                eventClick: function (calEvent, jsEvent, view) {

                    /*                        alert('Event: ' + calEvent.title);
                                                      alert('Coordinates: ' + jsEvent.pageX + ',' + jsEvent.pageY);
                      */                        //        alert('View: ' + view.name);

                    // $('#exampleModalLabel').html("New Entry: " + stDate[0] + "<br>" + stDate[1] + " to " + enDate[1]);


                    $scope.saveActions = "SaveUpdate"

                    updateObj.eventObj = calEvent;
                    updateObj.updateData._id = calEvent._id;

                    $('#exampleModalLabel').html(calEvent.title);
                    $('#txtDescription').val(calEvent.title);
                    $('#selectCategory').val(calEvent.category);
                    $('#selectWorkType').val(calEvent.worktype);
                    $('#selectProjectName').val(calEvent.projectname);

                    /* var updateObj = {
                         title: $('#txtDescription').val(),
                         category:  $('#selectCategory').val(),
                         worktype: $('#selectWorkType').val(),
                         projectname: $('#selectProjectName').val(),
                         _id: calEvent._id
                     }*/

                    $('#exampleModal').modal('toggle')

                    //http call: updateLogDetail

                    //    $('#exampleModalLabel').html(calEvent.title);
                    //   $('#exampleModal').modal('toggle')
                    // console.log('event click', calEvent._id)
                }
            });

            $scope.enableCalandar = true;

        });
    }
}