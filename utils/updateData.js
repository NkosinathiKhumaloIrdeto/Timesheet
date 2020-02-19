var mongoose = require('mongoose');
let logModal = require('./modals/log');

let mongodb_dev = "mongodb://localhost:27017/Timesheets";

mongoose.connect(mongodb_dev)
    .then(() => console.log('Connection succesful'))
    .catch((err) => console.error(err));


var searchQuery = {};

logModal.find(searchQuery).sort('startDate').exec((err, data) => {

    if (err) {

        res.status(500).send({ 'status': 500, 'msg': err });

        return;
    }

    var i = 0;
    var total = data.length// - 7900;
    var d1, d2;
    var x = 0;
    var c = 1;
    var updateObj = {}
    var id = "";

    for(i; i < total;i++){
        var obj =  data[i];
       
        d1 = new Date(obj.start);
        d2 = new Date(obj.end);
        x = calcHours(d1, d2)
        
        if (parseFloat(obj.hours) !== parseFloat(x))
        {   
            id = obj.id
            c++;

            updateObj = {
                hours : parseFloat(x)
            }

            console.log(obj)

/*            logModal.findByIdAndUpdate(id, { $set: updateObj }, { new: true }, function (err, updateObj_new) {
  
               console.log(updateObj_new);
        
            })*/

         /*   console.log(obj);
            console.log("hour a", obj.hours);
            console.log("hour b", x);
            console.log(obj.start + "-- " + obj.end);
            console.log('======================')*/

        }
       // obj.hours = calcHours(d1, d2);

       

        //console.log(i + "/" + total);
    } 

    console.log(c);

})

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