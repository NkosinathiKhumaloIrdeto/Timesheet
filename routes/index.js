let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
let _ = require('lodash');
let logModal = require('../modals/log');


router.get('/getAll', (req, res) => {

    logModal.find({}, (err, data) => {

        if (err) {
            res.status(500).send({ 'status': 500, 'msg': err });
            return;
        }
        res.send(data);

    })

})


router.post('/log', (req, res) => {
console.log(req.body)
    var newLogModal = new logModal(req.body);

    newLogModal.save(function (err) {

        if (err) { throw err; return; }

        res.status(200).send({ "message": "Added successfully" })

     //  return done(null, data);
    })

})

module.exports = router;