var mongoose = require('mongoose');

let Schema = mongoose.Schema;

let config_worktype = new Schema({
    description : String
})

module.exports = mongoose.model('config_worktype', config_worktype);