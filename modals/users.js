var mongoose = require('mongoose');

let Schema = mongoose.Schema;

let Users = new Schema({
    firstname : String,
    lastname : String,
    consultingFirm : String,
    company : String,
    contractor : String,
    contractorNumber : String,
    clientContactName : String,
    contractorContact : String,
    username: String

})

module.exports = mongoose.model('users', Users);