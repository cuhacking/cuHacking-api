const Database  = require('../model/database');
const ResourceController = module.exports;

const COLLECTION_NAME = 'resources';

const ALLOWED_ORIGIN = 'http://localhost:3000'; 


ResourceController.preflight = function(req, res) {

    res.setHeader('Access-Control-Allow-Origin', ALLOWED_ORIGIN); 
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS'); 
    res.setHeader('Access-Control-Allow-Headers', 'authorization, content-type');  
    res.sendStatus(200); 

}


ResourceController.getVersions = function(req, res){

    Database.getAll(COLLECTION_NAME).then(function(dbRes){
        let response = {};
        for(let item of dbRes){
            if(item.version !== undefined){
                response[item.name] = item.version;
            }
        }

        res.status(200).send(response);
    }).catch(function(err){
        res.status(500).send(err);
    });

}


ResourceController.createMap = function(req, res){

    Database.get(COLLECTION_NAME, "map").then(function(dbRes){
        res.status(400).send({
            "resource": "map",
            "operation": "create",
            "status": "failed",
            "message": "Map data already exists. Update it with a PATCH request instead"
        });
    }).catch(function(err){
        // TODO: Do I need to explicitly check the error message?
        Database.add(COLLECTION_NAME, "map", req.body.data).then(function(dbRes){
            res.status(201).send({
               "resource": "map",
                "operation": "create",
                "status": "success",
                "message": "Map data successfully created"
            });
        }).catch(function(err){
            res.status(500).send(err);
        })

    })

}


ResourceController.getMap = function(req, res){
    
}