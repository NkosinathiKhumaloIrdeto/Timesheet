let express = require('express');
let bodyParser = require('body-parser');
let _ = require('lodash');
const mysql = require('mysql');
var moment = require('moment');
var cors = require('cors');
let logModal = require('../modals/log');

//bulk injest


app.use(bodyParser.json());

app.post('/bulk-ingest', (req, res) => {

    var data_length = req.body.length;

    try {

        logModal.create(req.body, function (err) {

            if (err) { throw err; }

            res.status(200).send({ "message": "Added successfully", "length": data_length })

        })

    } catch (exc) {

        res.status(500).send(exc.message);

    }
    
})


app.listen(8016);

console.log("bulk running:8016");
