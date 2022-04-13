require("dotenv").config();

var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var routes = require('./routes/index');
var user_routes = require('./routes/userRoute');
var setting_routes = require('./routes/settings');
var mongoDbLib = require('./routes/mongdb');
let morgan = require('morgan');
let jira = require("./routes/jira");
let mysqllib = require('./routes/mysql');

const PORT = process.env.NODE_DOCKER_PORT || 8019;

app.use(bodyParser.json());
app.use(express.static('src'))
app.use('/data', routes);
app.use('/users', user_routes);
app.use('/settings', setting_routes)
app.use('/jira', jira);
app.use(morgan('dev'));

console.log("Start running app...");

//setup
let mongodb_dev = "mongodb://" + (process.env.ENV == 'DEV' ? "localhost" : process.env.MONGO_HOST) + ":" + (process.env.ENV == 'DEV' ? "27017" : process.env.MONGO_PORT) + "/" + process.env.MONGO_DB; // "mongodb://localhost:27017/Timesheets";

/*mongoose.connect(mongodb_dev)
    .then(() => console.log('Mongo DB Connection succesful'))
    .catch((err) => console.error(err)); */

mysqllib.createConnection();
mongoDbLib.createConnection(mongodb_dev);


app.listen(PORT);

console.log("App running on ...http://localhost:" + PORT);