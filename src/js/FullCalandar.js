$(document).ready(function () {

    var data = returData();

    //save button click
    $("#btn-save-entry").click(function () {
     //  
     dataEntry.title = $('#txtDescription').val()

     $('#calendar').fullCalendar('renderEvent',dataEntry);
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
        defaultDate:moment(new Date()),
        defaultView: 'agendaWeek',
        navLinks: true, // can click day/week names to navigate views
        editable: true,
        eventLimit: true, // allow "more" link when too many events
        selectable: true, //Allows a user to highlight multiple days or timeslots by clicking and dragging.
        select: function (startDate, endDate) {

            //            alert('selected ' + startDate.format() + ' to ' + endDate.format());

            var stDate = startDate.format().split("T");
            var enDate = endDate.format().split("T");

            dataEntry = {
                start: startDate.format(),
                end: endDate.format(),
            }

            $('#exampleModalLabel').html("New Entry: " + stDate[0] + "<br>" + stDate[1] + " to " + enDate[1]);

            $('#exampleModal').modal('toggle')
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
            /*{
                title: 'MCA-123',
                start: '2018-04-24T08:00:00',
                end: '2018-04-24T11:00:00',
            },
            {
                title: 'Team Meeting',
                start: '2018-04-24T11:00:00',
                end: '2018-04-24T12:00:00',
            },
            {
                title: 'Gym',
                start: '2018-04-24T12:00:00',
                end: '2018-04-24T13:00:00',
            },
            {
                title: 'MCA-123',
                start: '2018-04-24T13:15:00',
                end: '2018-04-24T16:00:00',
            }

            ,
            {
                id: 999,
                title: 'Repeating Event',
                start: '2018-04-09T16:00:00'
            },
            {
                id: 999,
                title: 'Repeating Event',
                start: '2018-04-16T16:00:00'
            },
            {
                title: 'Conference',
                start: '2018-04-11',
                end: '2018-04-13'
            },
            {
                title: 'Meeting',
                start: '2018-04-12T10:30:00',
                end: '2018-04-12T12:30:00'
            },
            {
                title: 'Lunch',
                start: '2018-04-12T12:00:00'
            },
            {
                title: 'Meeting',
                start: '2018-04-12T14:30:00'
            },
            {
                title: 'Happy Hour',
                start: '2018-04-12T17:30:00'
            },
            {
                title: 'Dinner',
                start: '2018-04-12T20:00:00'
            },
            {
                title: 'Birthday Party',
                start: '2018-04-13T07:00:00'
            },
            {
                title: 'Click for Google',
                url: 'http://google.com/',
                start: '2018-04-28'
            }
        ]*/
    }

});

