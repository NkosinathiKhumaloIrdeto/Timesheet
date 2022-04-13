'user strict';

const mongoose = require('mongoose');

let retry_config = Number(process.env.MY_SQL_RETRY);

let retry_count = 1;

const obj = {};

obj.connection = {}

obj.createConnection = function (connection_str) {

    console.log("Attempting to connect to MongoDB on: " + connection_str);

    while (retry_config) {

        try {

            obj.connection = mongoose.connect(connection_str);

            console.log("Connection to mongodb successful");

            break;

        } catch (err) {

            retry_count += 1;            

            setTimeout(() => {

                console.log("Connection to mongodb failed, retying: ${retry_count}")

            }, Number(process.env.MY_SQL_RETRY_TIMEOUT));

            retry_config -= 1;

        }


    }

}

module.exports = obj
