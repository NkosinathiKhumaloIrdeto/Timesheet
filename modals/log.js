var mongoose = require('mongoose');

let Schema = mongoose.Schema;

let Logs = new Schema({
    worktype: String,
    employee: String,
    category: String,
    start: String,
    end: String,
    hours:String,
    title:String,
    projectname: String
  
})

module.exports = mongoose.model('logs', Logs);