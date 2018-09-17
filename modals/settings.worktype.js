var mongoose = require('mongoose');

let Schema = mongoose.Schema;

let Sett_WorkType = new Schema({
    description : String,
    type: String
})

module.exports = mongoose.model('sett', Sett_WorkType);