let express = require('express');
let bodyParser = require('body-parser');
let _ = require('lodash');
const mysql = require('mysql');
var moment = require('moment');
var cors = require('cors')

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'timesheetdb'
});

connection.connect((err) => {
    if (err) throw err;
    console.log('Connected to SQL!');
});

let app = express();

app.use(bodyParser.json());
app.use(cors());
app.post('/bulkLog', (req, res) => {

    var sql = "INSERT INTO clients VALUES ?";

    var data = req.body;

    console.log(data);
    return;
    connection.query(sql, [data], (err, response) => {

        if (err) throw err;

        res.send({ "message": "Added successfully" })
    });

})

app.post('/getReport', (req, res) => {

    var q = "SELECT SUM(hours) as  hours,employee FROM `logs` where (projectname = 'DSTVO Billable');";
    console.log(req.body);
    connection.query(q, (err, rows) => {

        if (err) { console.log(err); throw err; }
        
        //res.writeHead(200, { 'Content-Type': 'application/json' }); 
        res.status(200).send(rows);
    });

    //res.send('working');
})

app.post('/bulkJobs', (req, res) => {

    var obj;
    var objs = []
    var payload = req.body.RECORDS;
    var sample_date;
    var final_obj = []
    var final_objs = []

    payload.forEach((value) => {

        //console.log(value)
        console.log("-------------------")

        final_obj.push(value._id.$oid)
        final_obj.push(value.category)
        final_obj.push(value.color)
        final_obj.push(value.employee)
        final_obj.push(formatDate(value.end))
        //final_obj.push(formatDate(value.endDate))
        final_obj.push(parseFloat(value.hours))
        final_obj.push(value.projectname)
        final_obj.push(formatDate(value.start))
        //final_obj.push(formatDate(value.startDate))
        final_obj.push(value.title)
        final_obj.push(value.worktype)

        console.log(final_obj)

        objs.push(final_obj)

        final_obj = []
    })

    var sql = "INSERT INTO timesheetdb.logs (id, category,color,employee,end,hours,projectname,start,title,worktype) VALUES ?";

    connection.query(sql, [objs], (err, response) => {

        if (err) throw err;

        res.send({ "message": "Added successfully" })
    });

    return;


    for (var i = 0; i < payload.length; i++) {

        obj = payload[i];

        sample_date = obj[8];

        obj[8] = formatDate(sample_date);

        sample_date = obj[9];

        obj[9] = formatDate(sample_date);

        delete obj['__v'];

        objs.push(obj);

    }
    console.log(objs);
    return;
    var sql = "INSERT INTO clientjobs (id, description,date, clientID, status, price) VALUES ?";

    connection.query(sql, [objs], (err, response) => {

        if (err) throw err;

        res.send({ "message": "Added successfully" })
    });

})

app.post('/bulkInvoices', (req, res) => {

    var obj;
    var objs = []
    var payload = req.body;
    var sample_date;

    for (var i = 0; i < payload.length; i++) {

        obj = payload[i];

        sample_date = obj[1];

        obj[1] = formatDate(sample_date);

        sample_date = obj[4];
        obj[4] = formatDate(sample_date);

        objs.push(obj);

    }
    var sql = "INSERT INTO clientinvoices (id, date, clientID, price,dueDate, clientName, invoiceNumber) VALUES ?";

    connection.query(sql, [objs], (err, response) => {

        if (err) throw err;

        res.send({ "message": "Added successfully" })
    });

})

function formatDate(strDate) {
    var d = new Date(strDate);
    return moment(d).format('YYYY-MM-DD HH:mm:ss')
}

app.listen(8016);

console.log("bulk running:8016");
