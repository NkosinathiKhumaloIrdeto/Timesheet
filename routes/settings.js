let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
let _ = require('lodash');
let sett_worktype = require('../modals/settings.worktype');


router.get('/getAllSettings/:type', (req, res) => {

    var type = req.params.type;

    sett_worktype.find({type}, (err, data) => {

        if (err) throw err

        res.status(200).send(data);
    })

})

router.get('/getAll', (req, res) => {

    sett_worktype.find({}, (err, data) => {

        if (err) throw err

        res.status(200).send(data);
    })

})


router.post ('/addSetting', (req,res)=>{

    sett_worktype.create(req.body, function (err) {

        if (err) { throw err; }

        res.status(200).send({ "message": "Added successfully"})

    })

})

router.post ('/deleteSetting', (req,res)=>{

    sett_worktype.deleteOne(req.body, (err) => {

        if (err) return err;

        res.status(200).send({ message: "Record deleted successfully" })

    })

})

/**
 logModal.deleteOne(req.body, (err) => {

        if (err) return err;

        res.status(200).send({ message: "Record deleted successfully" })

    })
 */

module.exports = router;