
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var routes = require('./routes/index');

app.use(bodyParser.json());
app.use(express.static('src')) 
//app.use('/demos', routes);
app.listen("8019");
console.log("App running on 8019..."); 
  