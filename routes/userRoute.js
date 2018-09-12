let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
let _ = require('lodash');
let usersModal = require('../modals/users');


router.get('/getUser/:name', (req, res) => {

    var username = req.params.name;

    usersModal.findOne({ contractor: username }, (err, data) => {

        if (err) throw err

        res.status(200).send(data);
    })

})

router.get('/getUsers', (req, res) => {

    usersModal.find({}, (err, data) => {

        if (err) throw err

        res.status(200).send(data);
    })

})

router.post ('/adduser', (req,res)=>{

    console.log("userdata", req.body);

    var new_user = new usersModal(req.body);

    new_user.save(function (err) {

        if (err) { throw err; }

        res.status(200).send({ "message": "Added successfully", id: new_user._id })

    })

})

module.exports = router;