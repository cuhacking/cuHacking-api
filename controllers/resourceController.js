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

/**
 * Gets the versions of all the resources
 */
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

/**
 * Gets the version of a specific resource
 */
ResourceController.getResourceVersion = function(req, res){
    
    let resource = req.params.resource;
    Database.get(COLLECTION_NAME, resource).then(function(dbRes){
        if(dbRes.version !== undefined){
            res.status(200).send({
                "resource": resource,
                "operation": "get",
                "status": "success",
                "message": "Map version successfully retrieved"
            });
        } else {
            res.status(404).send({
                "resource": resource,
                "operation": "get",
                "status": "failed",
                "message": "Version number not found"
            });
        }
    }).catch(function(err){
        res.status(500).send(err);
    });

}

/**
 * Create a new resource
 * Expects a resource in the parameters (e.g. /resource/map)
 */
ResourceController.createResource = function(req, res){

    let resource = req.params.resource;
    Database.get(COLLECTION_NAME, resource).then(function(dbRes){
        res.status(400).send({
            resource: resource,
            operation: "create",
            status: "failed",
            message: resource + " data already exists. Update it with a PATCH request instead"
        });

    }).catch(function(err){
        // TODO: Do I need to explicitly check the error message?
        let data = req.body.data;
        data.version = 1;
        Database.add(COLLECTION_NAME, resource, data).then(function(dbRes){
            res.status(201).send({
                resource: resource,
                operation: "create",
                status: "success",
                message: resource + " data successfully created"
            });
        }).catch(function(err){
            res.status(500).send(err);
        })

    })

}

/**
 * Update a resource
 * Expects a resource in the parameter (e.g. /resource/map)
 */
ResourceController.updateResource = function(req, res){

    let resource = req.params.resource;
    Database.get(COLLECTION_NAME, resource).then(function(dbRes){
        let data = res.body.data;
        data.version = dbRes.version + 1;

        Database.update(COLLECTION_NAME, resource, data).then(function(updateRes){
            res.status(201).send({
               resource: resource,
               operation: "create",
               status: "success",
               message: resource + " data successfully updated" 
            });
        }).catch(function(updateErr){
            res.status(500).send(updateErr);
        });
    }).catch(function(getErr){
        res.status(500).send(getErr);
    })  

}

/**
 * Get a specific resource
 * Expects a resource in the parameter (e.g. /resource/map)
 */
ResourceController.getResource = function(req, res){
    
    let resource = req.params.resource;
    Database.get(COLLECTION_NAME, resource).then(function(getRes){
        res.status(201).send({
            resource: resource,
            operation: "get",
            status: "success",
            data: getRes
        });
    }).catch(function(getErr){
        res.status(500).send(getErr);
    });

}

/**
 * Delete a resource
 * Expects a resource in the parameter (e.g. /resource/map)
 */
ResourceController.deleteResource = function(req, res){

    let resource = req.params.resource;
    let doc = Database.get(COLLECTION_NAME, resource);

    if(!doc){
        res.status(404).send({
            resource: resource,
            operation: 'delete',
            status: 'failed',
            message: 'Resource not found'
        });
    } else {
        Database.remove(COLLECTION_NAME, resource).then(function(){
            res.status(204).send({
                resource: resource,
                operation: 'delete',
                status: 'success',
                message: resource + ' successfully deleted' 
            });
        });
    }

}