require("dotenv").config();

var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var routes = require('./routes/index');
var user_routes = require('./routes/userRoute');
var setting_routes = require('./routes/settings');
var mongoose = require('mongoose');
let morgan = require('morgan');
let jira = require("./routes/jira");

const PORT = process.env.NODE_DOCKER_PORT || 8019;

app.use(bodyParser.json());
app.use(express.static('src'))
app.use('/data', routes);
app.use('/users', user_routes);
app.use('/settings', setting_routes)
app.use('/jira', jira);
app.use(morgan('dev'));

//setup
let mongodb_dev = "mongodb://" + process.env.MONGO_HOST + ":" + process.env.MONGO_PORT + "/" + process.env.Timesheets; // "mongodb://localhost:27017/Timesheets";

mongoose.connect(mongodb_dev)
    .then(() => console.log('Connection succesful'))
    .catch((err) => console.error(err));

app.listen(PORT);
console.log("App running on ...http://localhost:" + PORT);