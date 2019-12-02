
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var routes = require('./routes/index');
var user_routes = require('./routes/userRoute');
var setting_routes = require('./routes/settings');
var mongoose = require('mongoose');
let morgan = require('morgan');

app.use(bodyParser.json());
app.use(express.static('src'))
app.use('/data', routes);
app.use('/users', user_routes);
app.use('/settings',setting_routes)
app.use(morgan('dev'));

//setup
let mongodb_dev = "mongodb://localhost:27017/Timesheets";
let mongodb_live = "mongodb://172.27.1.101:27017/Timesheets";
mongoose.connect(mongodb_dev)
    .then(() => console.log('Connection succesful'))
    .catch((err) => console.error(err));

app.listen("8019");
console.log("App running on 8019...");
