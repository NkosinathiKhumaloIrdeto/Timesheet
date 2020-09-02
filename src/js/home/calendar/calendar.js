var calendarContr = function ($scope, $http, $state) {

    $scope.obj = { username: $state.params.username, disableDeleteButton: true };
    var url = "/data/getAll";
    var me = this;
    var queryUrl = "";
    var queryUrl = url + "/" + $scope.obj.username
    let updateObj = {
        updateData: {},
        eventObj: {}
    }

    $scope.catpureForm = {
        title: "",
        category: "",
        worktype: "",
        projectname: ""
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

        $scope.catpureForm.title = "";
        $scope.catpureForm.category = "";
        $scope.catpureForm.worktype = "";
        $scope.catpureForm.projectname = "";

        updateObj = {
            updateData: {},
            eventObj: {}
        }

        $('#title').val('');
        $('#category').val('');
        $('#worktype').val('');
        $('#projectname').val('');
        $('#jiranumber').val('');

    }

    loadData_category();
    loadData_worktype();
    loadData_projectname();

    function loadData_worktype() {

        $.getJSON("/settings/getAllSettings/worktype", function (result) {
            var options = $("#worktype");
            //don't forget error handling!
            var lst = _.orderBy(result, ['description'], ['asc']); // Use Lodash to sort array by 'name'
            $.each(result, function (item) {
                options.append($("<option />").val(lst[item].description).text(lst[item].description));
            });
        }, (err) => {
            alert("Unable to load worktype")
        });

    }

    function loadData_category() {
        //get all category


        $.getJSON("/settings/getAllSettings/category", function (result) {
            var options = $("#category");
            //don't forget error handling!
            var lst = _.orderBy(result, ['description'], ['asc']); // Use Lodash to sort array by 'name'
            $.each(lst, function (item) {
                options.append($("<option />").val(lst[item].description).text(lst[item].description));
            });
        }, (err) => {
            alert("Unable to load worktype")
        });
    }

    function loadData_projectname() {
        //get all projectname       

        $.getJSON("/settings/getAllSettings/projectname", function (result) {
            var options = $("#projectname");
            //don't forget error handling!
            var lst = _.orderBy(result, ['description'], ['asc']); // Use Lodash to sort array by 'name'

            $.each(lst, function (item) {
               
                options.append($("<option />").val(lst[item].description).text(lst[item].description));
            });
        }, (err) => {
            alert("Unable to load worktype")
        });
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
        endDate: '',
        jiraNumbers: []
    }
    

        /*<input auto-complete ui-items="names" class="form-control" name="jiranumber" id="jiranumber" ng-model="selected">
        */
       

    //<--- enable calendar here --->
    setUpCal();

    $scope.deleteEvent = function () {

        $scope.saveActions = "DeleteEvent";

        $scope.actionEvent();

        $scope.saveActions = "SaveUpdate";

    }

    function test() {
        $scope.catpureForm.title = 1

    };

    $scope.actionEvent = function () {

        switch ($scope.saveActions) {
            case "SaveNew":
                saveEvent();
                break;

            case "SaveUpdate":
                processEventUpdate();
                break;
            case "DeleteEvent":
                processEventDelete();
                break;
            default:
                alert("An Error has occurred. Please contact admin. log: #actionEvent()")
                break;
        }

    }

    function setusername() {

        if ($scope.obj.username == null) {
            $scope.obj.username = $state.params.username;
        }

        return $scope.obj.username;

    }



    function saveEvent() {

        $('#first').css("display", "block");

        var data = {
            employee: setusername(),
            title: $('#title').val(),
            category: $('#category').val(),
            worktype: $('#worktype').val(),
            projectname: $('#projectname').val(),
            hours: calcHours($scope.uiObj.start, $scope.uiObj.end), // timeToDecimal(getHours($scope.uiObj.end, $scope.uiObj.start)),
            color: eventColor($('#worktype').val()),
            start: $scope.uiObj.start,
            end: $scope.uiObj.end,
            startDate: $scope.uiObj.startDate,
            endDate: $scope.uiObj.endDate,
            jiranumber:$('#jiranumber').val()
        }

        //send data to server
        $http.post('/data/log', data)
            .then((response) => {

                $scope.uiObj.id = response.data.id;
                data.id = response.data.id;
                newLogID = response.data.id;

                $('#calendar').fullCalendar('renderEvent', data);
                $('#exampleModal').modal('hide')

                $scope.msg = {
                    error: "",
                    success: ""
                }

                showSnack(data.title + ": " + response.data.message);

                clearFields();
                $('#first').css("display", "none");

            }, (error) => {
                flagMessage("Error: ", error, 0);
                $('#first').css("display", "none");
            })

    }

    function eventColor(eventType) {

        var color = "#777777";

        switch (eventType) {
            case "NORMAL":
                color = "#843f7f";
                break;
        }

        return color;

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

        $scope.uiObj.start = startDate.format();
        $scope.uiObj.end = endDate.format();
        $scope.uiObj.startDate = startDate.format();
        $scope.uiObj.endDate = endDate.format();

        $('#exampleModalLabel').html("New Entry: " + stDate[0] + "<br>" + stDate[1] + " to " + enDate[1]);

        $('#exampleModal').modal('show')

    }

    function timeToDecimal(t) {

        var arr = t.split(':');

        return parseFloat(parseInt(arr[0], 10) + '.' + parseInt((arr[1] / 6) * 10, 10));
    }

    
function calcHours(startTime,endTime){

	var t1 = new Date(startTime);
	var t2 = new Date(endTime);
	
	var duration = t2 - t1;
	
	var milliseconds = parseInt((duration%1000)/100)
        , seconds = parseInt((duration/1000)%60)
        , minutes = parseInt((duration/(1000*60))%60)
        , hours = parseInt((duration/(1000*60*60))%24);

    hours = (hours < 10) ? hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    minutes = parseInt(minutes) == 30 ? "." + 5: "";
   // seconds = (seconds < 10) ? "0" + seconds : seconds;

    return hours + minutes;

}

    function processEventUpdate() {

        updateObj.updateData.title = $('#title').val();
        updateObj.updateData.category = $('#category').val();
        updateObj.updateData.worktype = $('#worktype').val();
        updateObj.updateData.projectname = $('#projectname').val();
        updateObj.updateData.jiranumber = $('#jiranumber').val();
        updateObj.updateData.color = eventColor($('#worktype').val());

        $('#first').css("display", "block");

        $http.post('/data/updateLogDetail', updateObj.updateData)
            .then((res) => {

                updateObj.eventObj.title = updateObj.updateData.title
                updateObj.eventObj.category = updateObj.updateData.category
                updateObj.eventObj.worktype = updateObj.updateData.worktype
                updateObj.eventObj.projectname = updateObj.updateData.projectname
                updateObj.eventObj.jiranumber = updateObj.updateData.jiranumber
                updateObj.eventObj.color = updateObj.updateData.color
                

                $('#calendar').fullCalendar('updateEvent', updateObj.eventObj);

                $('#first').css("display", "none");

                showSnack(updateObj.eventObj.title + ": " + res.data.message);

                $('#exampleModal').modal('hide');

                clearFields();

            }, (err) => {

                flagMessage("Error: ", err, 0);

            })

    }

    function processEventDelete() {

        if (!confirm("Are you sure you want to delete this entry?")) {
            return;
        }

        var id = "";

        if (updateObj.eventObj._id.length < 6) {

            id = updateObj.eventObj.id;

        } else {

            id = updateObj.eventObj._id;

        }

        $('#first').css("display", "block");

        $http.post('/data/deleteLog', { "_id": id })

            .then((res) => {

                $('#calendar').fullCalendar('removeEvents', id)

                $('#exampleModal').modal('hide');

                showSnack(res.data.message);

                $('#first').css("display", "none");

                clearFields();

                return;

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
                /*  eventDragStart: function( event, jsEvent, ui, view ) { 
  
                      eventMoveObj.start = "";
                      eventMoveObj.startDate = "";
  
                      eventMoveObj = {
                          start:"",
                          startDate:"",
                          end: "",
                          endDate:""
                      }
  
                      console.log("1",event)
                  },
                  eventDrop: function(event,dayDelta,minuteDelta,allDay,revertFunc) {
                  console.log(event);
                  return;
                      var startDate = event.startDate//.format();
                      var endDate = event.endDate//.format();
  
                      $scope.uiObj.end = endDate;
                      $scope.uiObj.endDate = event.end;
  
                      $scope.uiObj.start = startDate;
                      $scope.uiObj.startDate = event.start;
  
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
                  },*/
                eventResize: function (event, delta, revertFunc, jsEvent, ui, view) {

                    var startDate = event.start.format();
                    var endDate = event.end.format();

                    $scope.uiObj.end = endDate;
                    $scope.uiObj.endDate = event.end;

                    if (event._id.length < 6) {
                        $scope.uiObj._id = event.id;
                    } else {
                        $scope.uiObj._id = event._id;
                    }

                    $scope.uiObj.hours = calcHours(startDate, endDate), // timeToDecimal(getHours(endDate, startDate));

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

                    $scope.saveActions = "SaveNew";

                    $scope.obj.disableDeleteButton = true;

                    $('#btn-remove-entry').hide();

                    onSelect(startDate, endDate);

                },
                events: queryUrl,
                eventDrop: function (event, delta, revertFunc) {

                   // alert(event.title + " was dropped on " + event.start.format());
                 //  if (!confirm("Move event to: " + event.start.format() + "?")) {
                   //     revertFunc();
                   $('#modal_copymove').modal('toggle')
                     //   return;
                    //}
                    
                    eventData.event = event;
                    eventData.delta = delta;
                    eventData.revertFunc = revertFunc;

                },
                eventClick: function (calEvent, jsEvent, view) {

                    $scope.saveActions = "SaveUpdate";
                    clearFields();

                    $scope.obj.disableDeleteButton = false;

                    $('#btn-remove-entry').show();
                    if (calEvent._id.length < 6) {
                        updateObj.updateData.evID = calEvent.id;
                        updateObj.updateData._id = calEvent.id;
                    } else {
                        updateObj.updateData.evID = calEvent._id;
                        updateObj.updateData._id = calEvent._id;
                    }

                    updateObj.eventObj = calEvent;

                    $('#exampleModalLabel').html(calEvent.title);
                    $('#title').val(calEvent.title);
                    $('#category').val(calEvent.category);
                    $('#worktype').val(calEvent.worktype);
                    $('#projectname').val(calEvent.projectname);
                    $('#jiranumber').val(calEvent.jiranumber);
                    $('#exampleModal').modal('toggle')

                }
            });

            var eventData = {
                //event, delta, revertFunc
            }

            $('#btn-copy').click(function(){
                $('#modal_copymove').modal('toggle');
                copyEvent();
            })

            $('#btn-move').click(function(){
                $('#modal_copymove').modal('toggle');
                moveEvent();
            })

            $('.CopyMove-close').click(function(){
                eventData.revertFunc();
                eventData = {}
            })

            

            function moveEvent(){

                $('#first').css("display", "block");

                    var startDate = eventData.event.start.format();
                    var endDate = eventData.event.end.format();

                    var payload = {
                        start: eventData.event.start,
                        startDate: startDate,
                        end: eventData.event.end,
                        endDate: endDate,
                        hourse : calcHours(startDate, endDate),
                        _id: ""
                    }

                    if (eventData.event._id.length < 6) {
                        payload._id = eventData.event.id;
                    } else {
                        payload._id = eventData.event._id;
                    }

                    $http.post('/data/updateLogMove', payload)
                    .then((response) => {

                        $('#first').css("display", "none");
                        showSnack("Updated: " + response.data.message);
                        eventData = {};
                        
                    }, (error) => {
                        delete $scope.uiObj._id
                        flagMessage("Error:", error, 0);
                        console.log(error)
                        eventData.revertFunc();
                        eventData = {}
                    })
            }

            function copyEvent(){

                eventData.revertFunc();

                var startDate = eventData.event.start.format();
                var endDate = eventData.event.end.format();
                
                var data = {
                    employee: setusername(),
                    title: eventData.event.title,
                    category: eventData.event.category,
                    worktype: eventData.event.worktype,
                    projectname: eventData.event.projectname,
                    hours: calcHours(startDate,endDate),// eventData.event.hours,
                    jiranumber : eventData.event.jiranumber,
                    color: eventData.event.color,
                    start: eventData.event.start,
                        startDate: startDate,
                        end: eventData.event.end,
                        endDate: endDate,
                }
                
        
                //send data to server
                $http.post('/data/log', data)
                    .then((response) => {
        
                        $scope.uiObj.id = response.data.id;
                        data.id = response.data.id;
                                
                        $('#calendar').fullCalendar('renderEvent', data);
                        $('#exampleModal').modal('hide')
        
                        $scope.msg = {
                            error: "",
                            success: ""
                        }                        

                        showSnack(data.title + ": " + response.data.message);
                        eventData = {}
                        
                        $('#first').css("display", "none");
        
                    }, (error) => {
                        flagMessage("Error: ", error, 0);
                        $('#first').css("display", "none");
                        eventData = {}
                    })

            }

            
            $scope.enableCalandar = true;

        });
    }
}

