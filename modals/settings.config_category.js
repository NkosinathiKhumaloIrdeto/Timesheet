var mongoose = require('mongoose');

let Schema = mongoose.Schema;

let config_category = new Schema({
    description : String
})

module.exports = mongoose.model('config_category', config_category);