
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var routes = require('./routes/index');
var user_routes = require('./routes/userRoute');
var mongoose = require('mongoose');
let morgan = require('morgan');

app.use(bodyParser.json());
app.use(express.static('src'))
app.use('/data', routes);
app.use('/users', user_routes);
app.use(morgan('dev'));

//setup

mongoose.connect('mongodb://localhost:27017/Timesheets')
    .then(() => console.log('Connection succesful'))
    .catch((err) => console.error(err));


app.listen("8019");
console.log("App running on 8019...");
