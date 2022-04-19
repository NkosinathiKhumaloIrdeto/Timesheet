let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
let _ = require('lodash');
let mysql = require("./mysql");

//keywords
let config_category = require('../modals/settings.config_category');
let config_worktype = require('../modals/settings.config_worktype');
let config_worktype_category = require('../modals/settings.config_worktype_category');



//================================ WORK FLOW TYPE

//Add worktype - addWorkflowType
router.post('/addWorkType/:description', (req, res) => {

    var id = create_id();

    var description = req.params.description;

    var values = [id, description];

    var query = "INSERT INTO config_worktype (id, description) VALUES (?,?)";

    console.log(values);

    mysql.connection.query(query, values, function (err) {

        if (err) { throw err; }

        res.status(200).send({ "message": "Added successfully" })

    })

})

//Remove worktype
router.post('/removeWorkType/:id', (req, res) => {

    var id = req.params.id;

    var values = [id];

    //1st query if linked already
    var query_check = "SELECT cc.id FROM config_worktype_category cc WHERE cc.workflowtypeId = ?";
    var delete_links_query = "DELETE FROM config_worktype_category WHERE workflowtypeId = ?";
    var query = "DELETE FROM config_worktype WHERE id = ?";

    mysql.connection.query(query_check, id, function (err, result) {
        if (err) {
            throw err;
        }
        else {
            //result            

            if (result.length != 0) {

                //delete links

                console.log('deleting links');

                mysql.connection.query(delete_links_query, id, function (err) {

                    if (err) { throw err; }

                    //delete category
                    mysql.connection.query(query, id, function (err) {

                        if (err) { throw err; }

                        res.status(200).send({ "message": "Removed successfully" })

                    })


                })

            } else {

                //delete category
                mysql.connection.query(query, id, function (err) {

                    if (err) { throw err; }

                    res.status(200).send({ "message": "Removed successfully" })

                })

            }
        }
    }
    )


})

//Get worktype
router.get('/getAllWorktype', (req, res) => {

    var query = "SELECT * FROM config_worktype order by description asc";

    mysql.connection.query(query, function (err, result) {
        if (err) {
            throw err;
        }
        else {
            //result
            res.status(200).send(result);
        }
    });


})


//================================ WORK FLOW TYPE
//================================ project name


//Add worktype - addWorkflowType
router.post('/addProjectName/:description', (req, res) => {

    var id = create_id();

    var description = req.params.description;

    var values = [id, description];

    var query = "INSERT INTO config_project_name (id, description) VALUES (?,?)";


    mysql.connection.query(query, values, function (err) {

        if (err) { throw err; }

        res.status(200).send({ "message": "Added successfully" })

    })

})

//Remove worktype
router.post('/removeProjectName/:id', (req, res) => {

    var id = req.params.id;

    var values = [id];

    var query = "DELETE FROM config_project_name WHERE id = ?";

    console.log(values);

    mysql.connection.query(query, id, function (err) {

        if (err) { throw err; }

        res.status(200).send({ "message": "Removed successfully" })

    })

})


router.post('/removeCategory/:id', (req, res) => {

    var id = req.params.id;

    //1st query if linked already
    var query_check = "SELECT cc.id FROM config_worktype_category cc WHERE cc.categoryId = ?";
    var delete_links_query = "DELETE FROM config_worktype_category WHERE categoryId = ?";
    var query = "DELETE FROM config_category WHERE id = ?";

    mysql.connection.query(query_check, id, function (err, result) {
        if (err) {
            throw err;
        }
        else {
            //result            

            if (result.length != 0) {

                //delete links

                console.log('deleting links');

                mysql.connection.query(delete_links_query, id, function (err) {

                    if (err) { throw err; }

                    //delete category
                    mysql.connection.query(query, id, function (err) {

                        if (err) { throw err; }

                        res.status(200).send({ "message": "Removed successfully" })

                    })


                })

            } else {

                //delete projec
                mysql.connection.query(query, id, function (err) {

                    if (err) { throw err; }

                    res.status(200).send({ "message": "Removed successfully" })

                })

            }
        }
    }
    )


})


//Get worktype
router.get('/getAllProjectName', (req, res) => {

    var query = "SELECT * FROM config_project_name order by description asc";

    mysql.connection.query(query, function (err, result) {
        if (err) {
            throw err;
        }
        else {
            //result
            res.status(200).send(result);
        }
    });


})

//================================ project type

//================================ CATEGORY


//Add worktype - addWorkflowType
router.post('/addCategory/:description', (req, res) => {

    var id = create_id();

    var description = req.params.description;

    var values = [id, description];

    var query = "INSERT INTO config_category(id, description) VALUES (?,?)";

    mysql.connection.query(query, values, function (err) {

        if (err) { throw err; }

        res.status(200).send({ "message": "Added successfully" })

    })

})

//Remove worktype
router.post('/removeCategory1/:id', (req, res) => {

    var id = req.params.id;

    var values = [id];

    var query = "DELETE FROM config_category WHERE id = ?";

    console.log(values);

    mysql.connection.query(query, id, function (err) {

        if (err) { throw err; }

        res.status(200).send({ "message": "Removed successfully" })

    })

})

router.post('/removeLink/:id', (req, res) => {

    var id = req.params.id;

    var values = [id];

    var query = "DELETE FROM config_worktype_category  WHERE id = ?";

    console.log(values);

    mysql.connection.query(query, id, function (err) {

        if (err) { throw err; }

        res.status(200).send({ "message": "Removed successfully" })

    })

})

//

//Get worktype
router.get('/getAllCategory', (req, res) => {

    var query = "SELECT * FROM config_category order by description asc";

    mysql.connection.query(query, function (err, result) {
        if (err) {
            throw err;
        }
        else {
            //result
            res.status(200).send(result);
        }
    });


})

//================================ CATEGORY


function create_id() {
    return Math.floor((Math.random() * 999999) + 1);
}


//================================ CATEGORY
//Add category
router.get('/addCategory', (req, res) => {

    config_category.create(req.body, function (err) {

        if (err) { throw err; }

        res.status(200).send({ "message": "Added successfully" })

    })

})

//Get category
router.get('/getAllCategory', (req, res) => {

    var query = "SELECT * FROM config_category";

    mysql.connection.query(query, function (err, result) {
        if (err) {
            throw err;
        }
        else {
            //result
            res.status(200).send(result);
        }
    });

})



//================================ CATEGORY
//Add Project Name
router.get('/addProjectName', (req, res) => {

    config_category.create(req.body, function (err) {

        if (err) { throw err; }

        res.status(200).send({ "message": "Added successfully" })

    })

})

//Get category
router.get('/getAllProjectNames', (req, res) => {

    var query = "SELECT * FROM config_project_name";

    mysql.connection.query(query, function (err, result) {
        if (err) {
            throw err;
        }
        else {
            //result
            res.status(200).send(result);
        }
    });

})


//================================ get linked categories

//Get worktype
router.get('/getAllLinkedCat/:workflowid/', (req, res) => {

    var id = req.params.workflowid;

    var query = "SELECT cc.* FROM config_worktype_category cwc JOIN config_worktype cw on cw.id = cwc.workflowtypeId JOIN config_category cc on cc.id = cwc.categoryId WHERE cwc.workflowtypeId = ?";

    mysql.connection.query(query, id, function (err, result) {
        if (err) {
            throw err;
        }
        else {
            //result
            res.status(200).send(result);
        }
    });

})

//SELECT cw.description, cc.description FROM config_worktype_category cwc JOIN config_worktype cw on cw.id = cwc.workflowtypeId JOIN config_category cc on cc.id = cwc.categoryId 

router.get('/getAllLinkedCats', (req, res) => {
    var query = "SELECT cwc.id, cw.description as worktype, cc.description as category FROM config_worktype_category cwc JOIN config_worktype cw on cw.id = cwc.workflowtypeId JOIN config_category cc on cc.id = cwc.categoryId";

    mysql.connection.query(query, function (err, result) {
        if (err) {
            throw err;
        }
        else {
            //result
            res.status(200).send(result);
        }
    });

})

router.get('/getEmailSettings', (req, res) => {
    var query = "SELECT `id`, `subject`, `emailAddresses`, `emailBody` FROM `config_emails_report`";

    mysql.connection.query(query, function (err, result) {
        if (err) {
            throw err;
        }
        else {
            //result
            res.status(200).send(result);
        }
    });

})


router.get('/addLinkedCat/:workflowid/:categoryid', (req, res) => {

    var id = create_id();
    var data_check = [req.params.workflowid, req.params.categoryid]
    var data = [id, req.params.workflowid, req.params.categoryid]

    //1st query if linked already
    var query_check = "SELECT cc.* FROM config_worktype_category cc WHERE cc.workflowtypeId = ? AND cc.categoryId = ?";

    mysql.connection.query(query_check, data_check, function (err, result) {
        if (err) {
            throw err;
        }
        else {
            //result


            if (result.length == 0) {

                var query = "INSERT INTO config_worktype_category (id, workflowtypeId, categoryId) VALUES (?,?,?)";

                mysql.connection.query(query, data, function (err, result) {
                    if (err) {
                        throw err;
                    }
                    else {
                        //result
                        res.status(200).send(result);
                    }
                });
            } else {
                res.status(500).send({ "status": "500", "message": "Category link exists, please try another category." });
            }


        }
    });

    /*
    var data = [id, req.params.workflowid, req.params.categoryid]

    var query = "INSERT INTO config_worktype_category (id, workflowtypeId, categoryId) VALUES (?,?,?)";

    mysql.query(query,data, function (err, result) {             
        if(err) {
           throw err;
        }
        else{
            //result
            res.status(200).send(result);
        }
    });   
*/
})




//================================ WORK FLOW TYPE & CATEGORY 
//Add category
router.get('/addWorktypeCategory', (req, res) => {

    config_worktype_category.create(req.body, function (err) {

        if (err) { throw err; }

        res.status(200).send({ "message": "Added successfully" })

    })

})



module.exports = router;