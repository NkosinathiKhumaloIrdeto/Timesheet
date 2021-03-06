let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
let _ = require('lodash');
let logModal = require('../modals/log');
let usersModal = require('../modals/users');
let moment = require('moment');
let Json2csvParser = require('json2csv').Parser;
let fs = require('fs-extra');
let mysql = require("./mysql");

router.get('/getAll/:username', (req, res) => {

    var startDate, endDate;

    startDate = moment(new Date(req.query.start));

    endDate = moment(new Date(req.query.end))

    startDate.set({ h: 00, m: 00 });
    endDate.set({ h: 23, m: 59 });

    var searchQuery = {
        employee: new RegExp("^" + req.params.username),
        startDate: { $gte: startDate, $lte: endDate }
    }

    logModal.find(searchQuery).sort('startDate').exec((err, data) => {

        if (err) {
            res.status(500).send({ 'status': 500, 'msg': err });
            return;
        }

        res.send(data);

    })

})


router.get('/getByNameReport/:username', (req, res) => {

    var startDate, endDate;

    startDate = getAdjustedStartDate()

    endDate = getAdjustedEndDate()

    startDate.set({ h: 00, m: 00 });
    endDate.set({ h: 23, m: 59 });

    var searchQuery = {
        employee: new RegExp("^" + req.params.username),
        startDate: { $gte: startDate, $lte: endDate }
    }

    logModal.find(searchQuery).sort('startDate').exec((err, data) => {

        if (err) {

            res.status(500).send({ 'status': 500, 'msg': err });
            return; 
        }

        let total_hours = calHours(data)

        let status = 0

        if (total_hours < 130){

            console.log("Incomplete timesheets for: " + req.params.username + ". Total hours: " + total_hours );

        } else {status = 1;}

        res.send({"total" : total_hours, "status" : status, "message" : "Incomplete timesheets for " + req.params.username + ". Total hours: " + total_hours });

    })

})
function getAdjustedStartDate(){

    //get current for the past
    let start_date = moment().subtract(1, "months").date(24);
    
    return start_date;
  
  }
  
  function getAdjustedEndDate(){
  
    //get current for the past
    let end_date = moment().date(24);
    
    return end_date;
  
  }


router.get('/get', (req, res) => {

    var csvPath = "./src/Report/generated/";
    var csvName = "FileExport" + getRandomInt(1, 9999) + ".csv";
    var fullname = csvPath + csvName

    var fields = ['cars', 'color']


    var opts = { fields, delimiter: '\t' };

    myData = [{
        "car": "Audi",
        "price": 40000,
        "color": "blue"
    }, {
        "car": "BMW",
        "price": 35000,
        "color": "black"
    }, {
        "car": "Porsche",
        "price": 60000,
        "color": "green"
    }]

    try {
        const parser = new Json2csvParser(opts);

        const csv = parser.parse(myData);

        fs.writeFile(fullname, csv, 'utf8', function(err) {

            if (err) {

                res.status(500).send(err);

                return console.log(err);

            }

            res.writeHead(200, {
                "Content-Type": "application/octet-stream",
                "Content-Disposition": "attachment; filename=" + csvName
            });

            fs.createReadStream(fullname).pipe(res);

        });


    } catch (err) {
        console.error(err);
    }

})


router.post('/log', (req, res) => {
console.log("req",req.body);
    var newLogModal = new logModal(req.body);

    newLogModal.save(function(err) {

        if (err) { throw err; }

        res.status(200).send({ "message": "Added Successfully", id: newLogModal._id })

    })

})

//updateLog
router.post('/updateLogResize', (req, res) => {

    var updatedObj = {
        end: req.body.end,
        //  start: req.body.start, //new
        hours: req.body.hours,
        endDate: new Date(req.body.endDate),
        //  startDate: new Date(req.body.startDate)
    }

    var _id = req.body._id

    logModal.findByIdAndUpdate(_id, { $set: updatedObj }, { new: true }, function(err, updatedObj) {

        if (err) throw err;

        res.status(200).send({ message: "Record updated successfully", updatedObj })

    })

})



//updateLog
router.post('/updateLogMove', (req, res) => {

    var updatedObj = {
        end: req.body.end,
        start: req.body.start, //new
        endDate: new Date(req.body.endDate),
        startDate: new Date(req.body.startDate)
    }

    var _id = req.body._id

    logModal.findByIdAndUpdate(_id, { $set: updatedObj }, { new: true }, function(err, updatedObj) {

        if (err) throw err;

        res.status(200).send({ message: "Record updated successfully", updatedObj })

    })

})

router.post('/updateLogDetail', (req, res) => {

    var updatedObj = req.body;

    var _id = updatedObj._id;

    delete updatedObj._id; //just so we don't overwrite the existing record

    logModal.findByIdAndUpdate(_id, { $set: updatedObj }, { new: true }, function(err, updatedObj) {

        if (err) return err

        res.status(200).send({ message: "Record updated successfully", updatedObj })

    })

})

router.post('/deleteLog', (req, res) => {

    logModal.deleteOne(req.body, (err) => {

        if (err) return err;

        res.status(200).send({ message: "Record deleted successfully" })

    })

})

router.get('/getUser/:name', (req, res) => {

    var username = req.params.name;

    usersModal.findOne({ contractor: username }, (err, data) => {

        if (err) throw err

        res.status(200).send(data);
    })

})

router.get('/getUser/:name', (req, res) => {

    var username = req.params.name;

    usersModal.findOne({ contractor: username }, (err, data) => {

        if (err) throw err

        res.status(200).send(data);
    })

})

router.get('/getBy/:fromDate/:toDate/:username', (req, res) => {

    var startDate, endDate;

    startDate = moment(new Date(req.params.fromDate));

    endDate = moment(new Date(req.params.toDate));

    startDate.set({ h: 00, m: 01 });

    endDate.set({ h: 23, m: 59 });

    //startDate.add(1, 'days');

    //endDate.add(1, 'days');
    //update
    var searchQuery = {
        "startDate": { $gte: startDate, $lte: endDate },
        employee: new RegExp("^" + req.params.username),
        "title": new RegExp(req.query.filterBy, 'i') // {$regex: "/.*" + req.query.filterBy + "./", $options:"i"} 
            //"title":new RegExp("/" + req.query.filterBy + "/i")
    };

    logModal.find(searchQuery).sort('startDate').exec((err, data) => {

        if (err) {
            res.status(500).send({ 'status': 500, 'msg': err });
            return;
        }

        res.status(200).send(data);

    })

})



router.get('/getAllBy/:fromDate/:toDate', (req, res) => {

    var startDate, endDate;

    startDate = moment(new Date(req.params.fromDate));

    endDate = moment(new Date(req.params.toDate));

    startDate.set({ h: 00, m: 00 });

    endDate.set({ h: 23, m: 59 });

    //startDate.add(1, 'days');

    //endDate.add(1, 'days');
    //update
    var searchQuery = {
        "startDate": { $gte: startDate, $lte: endDate }
        //employee: new RegExp("^" + req.params.username) ,
        //"title": new RegExp(req.query.filterBy, 'i') // {$regex: "/.*" + req.query.filterBy + "./", $options:"i"} 
        //"title":new RegExp("/" + req.query.filterBy + "/i")
    };

    logModal.find(searchQuery).sort('startDate').exec((err, data) => {

        if (err) {
            res.status(500).send({ 'status': 500, 'msg': err });
            return;
        }

        res.status(200).send(data);

    })

})

router.get('/exportAllCSV/:fromDate/:toDate', (req, res) => {

    var csvPath = "./src/Report/generated/";
    var csvName = "FileExport" + getRandomInt(1, 9999) + ".csv";
    var fullname = csvPath + csvName

    var startDate, endDate;

    var startDate, endDate;

    startDate = moment(new Date(req.params.fromDate));

    endDate = moment(new Date(req.params.toDate));

    startDate.set({ h: 00, m: 00 });

    endDate.set({ h: 23, m: 59 });

    //startDate.add(1, 'days');

    //endDate.add(1, 'days');

    var searchQuery = { "startDate": { $gte: startDate, $lte: endDate } };
    
    logModal.find(searchQuery).sort('startDate').exec((err, data) => {

        if (err) {
            res.status(500).send({ 'status': 500, 'msg': err });
            return;
        }

        data = updateTime(data)

        var csvName = "FileExport" + getRandomInt(1, 9999) + ".csv";

        var fullname = csvPath + csvName

        //var fields = ['worktype', 'employee', 'category', "start", "projectname", "hours", "title", "jiranumber"]
        //var fields = ['worktype','category', 'employee', "start", "end", "projectname", "hours", "title", "jiranumber"]
        var fields = ['category', 'employee', "start", "end", "projectname", "hours", "title", "jiranumber"]
        
        var opts = { fields, delimiter: ",", quote: '' };

        try {

            const parser = new Json2csvParser(opts);

            const csv = parser.parse(data);

            fs.writeFile(fullname, csv, 'utf8', function(err) {

                if (err) {

                    res.status(500).send(err);

                    return;

                }

                res.writeHead(200, {
                    "Content-Type": "application/octet-stream",
                    "Content-Disposition": "attachment; filename=" + csvName
                });

                fs.createReadStream(fullname).pipe(res);

            });


        } catch (err) {

        }


        // res.status(200).send(data);

    })

})

router.get('/exportCSV/:fromDate/:toDate/:username', (req, res) => {

    var csvPath = "./src/Report/generated/";
    var csvName = "FileExport" + getRandomInt(1, 9999) + ".csv";
    var fullname = csvPath + csvName
    var startDate, endDate;

    var startDate, endDate;

    startDate = moment(new Date(req.params.fromDate));

    endDate = moment(new Date(req.params.toDate));

    startDate.set({ h: 00, m: 00 });

    endDate.set({ h: 23, m: 59 });

    startDate.add(1, 'days');

    endDate.add(1, 'days');

    var searchQuery = { "startDate": { $gte: startDate, $lte: endDate }, employee: new RegExp("^" + req.params.username) };
    
    logModal.find(searchQuery).sort('startDate').exec((err, data) => {

        if (err) {
            res.status(500).send({ 'status': 500, 'msg': err });
            return;
        }

        data = updateTime(data)

        var csvName = "FileExport" + getRandomInt(1, 9999) + ".csv";

        var fullname = csvPath + csvName

        var fields = ['category', 'employee', "start", "end", "projectname", "hours", "title", "jiranumber"]
        //var fields = ['worktype', 'employee', 'category', 'sub-category', "start", "projectname", "hours", "title", "jiranumber"]
        var opts = { fields, delimiter: ",", quote: '' };

        try {

            const parser = new Json2csvParser(opts);

            const csv = parser.parse(data);

            fs.writeFile(fullname, csv, 'utf8', function(err) {

                if (err) {

                    res.status(500).send(err);

                    return console.log(err);

                }

                res.writeHead(200, {
                    "Content-Type": "application/octet-stream",
                    "Content-Disposition": "attachment; filename=" + csvName
                });

                fs.createReadStream(fullname).pipe(res);

            });


        } catch (err) {

        }


        // res.status(200).send(data);

    })

})

function updateTime(data) {

    for (var i = 0; i < data.length; i++) {

        var obj = data[i];
        var hours = data[i].hours
        var end = data[i].end.split('T')[0]
        var start = data[i].start.split('T')[0]
        data[i].start = start // data[i].start
        data[i].end = end
           
        if (hours.length > 3) {
            data[i].hours = timeToDecimal(hours)
        } else {
            data[i].hours = parseFloat(data[i].hours).toFixed(2)
        }

    }

    return data

}

function calHours(data) {

    let hrs_total = 0;
    let hours = 0;

    for (var i = 0; i < data.length; i++) {

        hours =  parseFloat(data[i].hours)

        //console.log(hours)
       /* if (hours.length > 3) {
            hours = parseFloat(timeToDecimal(hours))
        } else {
            hours = parseFloat(hours).toFixed(2)
        }*/       

        hrs_total += hours;

    }

    return hrs_total

}

function timeToDecimal(t) {

    var arr = t.split(':');

    return parseFloat(parseInt(arr[0], 10) + '.' + parseInt((arr[1] / 6) * 10, 10)).toFixed(2);
}

function getRandomInt(min, max) {
    var randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;

    return randomNumber;
}

module.exports = router;