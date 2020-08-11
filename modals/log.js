var mongoose = require('mongoose');

let Schema = mongoose.Schema;

let Logs = new Schema({
    worktype: String,
    employee: String,
    category: String,
    start: String,
    end: String,
    startDate: Date,
    endDate: Date,
    hours: String,
    title: String,
    projectname: String,
    logid: String,
    color: String,
    jiranumber: String
})

module.exports = mongoose.model('logs', Logs);