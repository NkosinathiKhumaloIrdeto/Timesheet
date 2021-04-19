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

    mysql.query(query,values, function (err) {

        if (err) { throw err; }

        res.status(200).send({ "message": "Added successfully"})

    })

})

//Remove worktype
router.post('/removeWorkType/:id', (req, res) => {

    var id = req.params.id;

    var values = [id];

    var query = "DELETE FROM config_worktype WHERE id = ?";

    console.log(values);

    mysql.query(query,id, function (err) {

        if (err) { throw err; }

        res.status(200).send({ "message": "Removed successfully"})

    })

})

//Get worktype
router.get('/getAllWorktype', (req, res) => {

    var query = "SELECT * FROM config_worktype order by description asc";

    mysql.query(query, function (err, result) {             
        if(err) {
           throw err;
        }
        else{
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


    mysql.query(query,values, function (err) {

        if (err) { throw err; }

        res.status(200).send({ "message": "Added successfully"})

    })

})

//Remove worktype
router.post('/removeProjectName/:id', (req, res) => {

    var id = req.params.id;

    var values = [id];

    var query = "DELETE FROM config_project_name WHERE id = ?";

    console.log(values);

    mysql.query(query,id, function (err) {

        if (err) { throw err; }

        res.status(200).send({ "message": "Removed successfully"})

    })

})

//Get worktype
router.get('/getAllProjectName', (req, res) => {

    var query = "SELECT * FROM config_project_name order by description asc";

    mysql.query(query, function (err, result) {             
        if(err) {
           throw err;
        }
        else{
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

    mysql.query(query,values, function (err) {

        if (err) { throw err; }

        res.status(200).send({ "message": "Added successfully"})

    })

})

//Remove worktype
router.post('/removeCategory/:id', (req, res) => {

    var id = req.params.id;

    var values = [id];

    var query = "DELETE FROM config_category WHERE id = ?";

    console.log(values);

    mysql.query(query,id, function (err) {

        if (err) { throw err; }

        res.status(200).send({ "message": "Removed successfully"})

    })

})

router.post('/removeLink/:id', (req, res) => {

    var id = req.params.id;

    var values = [id];

    var query = "DELETE FROM config_worktype_category  WHERE id = ?";

    console.log(values);

    mysql.query(query,id, function (err) {

        if (err) { throw err; }

        res.status(200).send({ "message": "Removed successfully"})

    })

})

//

//Get worktype
router.get('/getAllCategory', (req, res) => {

    var query = "SELECT * FROM config_category order by description asc";

    mysql.query(query, function (err, result) {             
        if(err) {
           throw err;
        }
        else{
            //result
            res.status(200).send(result);
        }
    }); 

   
})

//================================ CATEGORY


function create_id(){
    return Math.floor((Math.random() * 999999) + 1);
}


//================================ CATEGORY
//Add category
router.get('/addCategory', (req, res) => {

    console.log(req.body);

    config_category.create(req.body, function (err) {

        if (err) { throw err; }

        res.status(200).send({ "message": "Added successfully"})

    })

})

//Get category
router.get('/getAllCategory', (req, res) => {

    var query = "SELECT * FROM config_category";

    mysql.query(query, function (err, result) {             
        if(err) {
           throw err;
        }
        else{
            //result
            res.status(200).send(result);
        }
    }); 

})



//================================ CATEGORY
//Add Project Name
router.get('/addProjectName', (req, res) => {

    console.log(req.body);

    config_category.create(req.body, function (err) {

        if (err) { throw err; }

        res.status(200).send({ "message": "Added successfully"})

    })

})

//Get category
router.get('/getAllProjectNames', (req, res) => {

    var query = "SELECT * FROM config_project_name";

    mysql.query(query, function (err, result) {             
        if(err) {
           throw err;
        }
        else{
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

    mysql.query(query,id, function (err, result) {             
        if(err) {
           throw err;
        }
        else{
            //result
            res.status(200).send(result);
        }
    });   

})

//SELECT cw.description, cc.description FROM config_worktype_category cwc JOIN config_worktype cw on cw.id = cwc.workflowtypeId JOIN config_category cc on cc.id = cwc.categoryId 

router.get('/getAllLinkedCats', (req, res) => {
    var query = "SELECT cwc.id, cw.description as worktype, cc.description as category FROM config_worktype_category cwc JOIN config_worktype cw on cw.id = cwc.workflowtypeId JOIN config_category cc on cc.id = cwc.categoryId";

    mysql.query(query, function (err, result) {             
        if(err) {
           throw err;
        }
        else{
            //result
            res.status(200).send(result);
        }
    });   

})


router.get('/addLinkedCat/:workflowid/:categoryid', (req, res) => {

    var id = create_id();
    var data_check = [req.params.workflowid, req.params.categoryid]
    var data = [id, req.params.workflowid, req.params.categoryid]

    console.log(data_check);

    //1st query if linked already
    var query_check = "SELECT cc.* FROM config_worktype_category cc WHERE cc.workflowtypeId = ? AND cc.categoryId = ?";

    mysql.query(query_check,data_check, function (err, result) {             
        if(err) {
           throw err;
        }
        else{
            //result
            
            
            if (result.length == 0){

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
            } else {
                 res.status(500).send({"status":"500", "message" : "Category link exists, please try another category."});
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

    console.log(req.body);

    config_worktype_category.create(req.body, function (err) {

        if (err) { throw err; }

        res.status(200).send({ "message": "Added successfully"})

    })

})




/*

router.get('/getAllSettings/:type', (req, res) => {

    var type = req.params.type;

    sett_worktype.find({type}, (err, data) => {

        if (err) throw err

        res.status(200).send(data);
    })

})


router.get('/getAllSettings_2/:type', (req, res) => {

    var type = req.params.type;

    sett_worktype.find({type}, (err, data) => {

        if (err) throw err

        res.status(200).send(data);
    })

})

router.get('/getAll', (req, res) => {

    sett_worktype.find({}, (err, data) => {

        if (err) throw err

        res.status(200).send(data);
    })

})


router.post ('/addSetting', (req,res)=>{

    sett_worktype.create(req.body, function (err) {

        if (err) { throw err; }

        res.status(200).send({ "message": "Added successfully"})

    })

})

router.post ('/deleteSetting', (req,res)=>{

    sett_worktype.deleteOne(req.body, (err) => {

        if (err) return err;

        res.status(200).send({ message: "Record deleted successfully" })

    })

}) */

/**
 logModal.deleteOne(req.body, (err) => {

        if (err) return err;

        res.status(200).send({ message: "Record deleted successfully" })

    })
 */

module.exports = router;