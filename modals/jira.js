var mongoose = require('mongoose');

let Schema = mongoose.Schema;

let Sett_WorkType = new Schema({
    description : String,
    type: String,
    jiranumber: {type: String, indexe: {unique: true}}
})

module.exports = mongoose.model('jira', Sett_WorkType); 