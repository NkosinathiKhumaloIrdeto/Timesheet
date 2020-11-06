var mongoose = require('mongoose');

let Schema = mongoose.Schema;

let config_worktype_category = new Schema({
    workflowId : String,
    categoryId: String
})

module.exports = mongoose.model('config_worktype_category', config_worktype_category);