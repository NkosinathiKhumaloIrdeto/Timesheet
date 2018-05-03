let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
let _ = require('lodash');
let logModal = require('../modals/log');
let usersModal = require('../modals/users');
let moment = require('moment');

router.get('/getAll/:username', (req, res) => {

    var startDate, endDate;

    startDate = new Date(req.query.start)

    endDate = new Date(req.query.end)

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


router.post('/log', (req, res) => {

    var newLogModal = new logModal(req.body);

    newLogModal.save(function (err) {

        if (err) { throw err; return; }

        res.status(200).send({ "message": "Added successfully" })

        //  return done(null, data);
    })

})

//updateLog
router.post('/updateLog', (req, res) => {

    var updatedObj = {
        end: req.body.end,
        hours: req.body.hours
    }
    console.log(req.body._id)
    var _id = req.body._id

    logModal.findByIdAndUpdate(_id, { $set: updatedObj }, { new: true }, function (err, updatedObj) {

        if (err) throw err;

        res.status(200).send(updatedObj)

    })


})

router.get('/getUser/:name', (req, res) => {

    var username = req.params.name;

    usersModal.findOne({ contractor: username }, (err, data) => {

        if (err) throw err

        res.status(200).send(data);
    })

})

router.get('/getBy/:fromDate/:toDate', (req, res) => {

    var startDate, endDate;

    startDate = new Date(req.params.fromDate)

    endDate = new Date(req.params.toDate)

    var searchQuery = { "startDate": { $gte: startDate, $lte: endDate } };

    logModal.find(searchQuery).sort('startDate').exec((err, data) => {

        if (err) {
            res.status(500).send({ 'status': 500, 'msg': err });
            return;
        }

        res.status(200).send(data);

    })

    /*logModal.find(searchQuery, (err, data) => {

        if (err) {
            res.status(500).send({ 'status': 500, 'msg': err });
            return;
        }

        res.status(200).send(data);

    }) */
})

module.exports = router;