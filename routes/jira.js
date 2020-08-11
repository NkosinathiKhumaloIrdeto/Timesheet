let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
let _ = require('lodash');
let jira = require('../modals/jira');


router.get('/getAllSettings/:type', (req, res) => {

    var type = req.params.type;

    jira.find({ type }, (err, data) => {

        if (err) throw err

        res.status(200).send(data);
    })

})

router.get('/getAll', (req, res) => {

    jira.find({}, (err, data) => {

        if (err) throw err
        //  console.log("hit", data);
        res.status(200).send(data);
    })

})


router.post('/addJIra', (req, res) => {

    //do check for existing one first
    jira.find({ jiranumber: req.body.jiranumber }, (err, data) => {

        if (err) throw err

        // res.status(200).send(data);
        console.log(req.body);
        if (data.length == 0) {
            jira.create(req.body, function (err) {

                if (err) { throw err; }

                res.status(200).send({ "message": "Added successfully" })

            })
        } else {

            res.status(500).send({ "message": "Jira already exisits (" + data[0].jiranumber + "): " + data[0].description })
        }
    })
})


router.post('/importJiras1', (req, res) => {

    var obj = req.body;
    var new_obj = []
    var new_data = {}
    var i = 0;
    var count = 0;

    for (i = 0; i < obj.length; i++) {

        new_data = obj[i]

        jira.find({jiranumber: new_data.jiranumber }, (err, data) => {

            count++;

            if (data.length == 0) {

                jira.create(new_data, function (err) {

                    if (err) { throw err; }
                    
                    count++;
        
                }) 

            } else {console.log('null',data)}

        })

    }

    res.status(200).send({"message": count + " - Were imported successfully" })

})


router.post('/importJiras', (req, res) => {

    jira.create(req.body, function (err) {

        if (err) { throw err; }
    

    }) 
    res.status(200).send({"message": "Imported successfully" })

})

router.post('/deleteSetting', (req, res) => {

    jira.deleteOne(req.body, (err) => {

        if (err) return err;

        res.status(200).send({ message: "Record deleted successfully" })

    })

})	

module.exports = router;