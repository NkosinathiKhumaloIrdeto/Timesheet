'user strict';

var mysql = require('mysql');

const connectin_config = {
    host: process.env.ENV == 'DEV' ? 'localhost' : process.env.MY_SQL_HOST,
    user: process.env.MY_SQL_USER,
    password: process.env.ENV == 'DEV' ? '' : process.env.MY_SQL_ROOT_PASSWORD,
    database: process.env.MY_SQL_DATABASE,
    port: process.env.ENV == 'DEV' ? '3306' : process.env.MY_SQL_APP_PORT
}

let retry_config = process.env.MY_SQL_RETRY;

let retry_count = 1;

const obj = {};

obj.connection = {}

obj.createConnection = function () {

    console.log("Attempting to connect to MongoDB on: " , connectin_config);

    while (retry_config) {

        try {
            obj.connection = mysql.createConnection(connectin_config);

            console.log("Connection to mysql successful");

            break;

        } catch (err) {

            retry_count += 1;

            setTimeout(() => {
                console.log("Connection to mysql failed, retying: ${retry_count}")
            }, Number(process.env.MY_SQL_RETRY_TIMEOUT));

            retry_config -= 1;

        }


    }

}

module.exports = obj
