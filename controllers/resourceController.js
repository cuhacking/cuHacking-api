const generateId = require('shortid') // We're going to need this for creating the schedule
const Database = require('../model/database');

ResourceController = module.exports;

ResourceController.preflight = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', ALLOWED_ORIGIN); 
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS'); 
  res.setHeader('Access-Control-Allow-Headers', 'authorization, content-type');  
  res.sendStatus(200); 
};

ResourceController.getAll = (req, res, resource) => {
  
  Database.getAll(resource).then((scheduleObject) => {
    scheduleObject.version = scheduleObject.version.version; // Get version to the top-level
    res.status(200).json(scheduleObject);
  }).catch((err) => {
    res.sendStatus(500);
  });

};

ResourceController.get = (req, res, resource) => {
    
    Database.get(resource, req.params.id).then((event) => {
        res.status(200).json(event);
    }).catch((err) => {
        res.sendStatus(404);
    });

};

ResourceController.getVersion = (req, res, resource) => {

    Database.get(resource, "version").then((versionObj) => {
        res.status(200).json(versionObj.version);
    });

};

ResourceController.add = (req, res, resource) => {

    let id = generateId.generate();
    // Need to do this since database model gets the key from the data
    // TODO: refactor so that the key doesn't need to be in the data
    req.body['id'] = id;
    Database.add(resource, 'id', req.body).then(() => {
        return updateVersion();
    }).then((version) => {
        res.status(200).json({"version": version, "id": id});
    }).catch((err) => {
        res.sendStatus(500);
    });

};

ResourceController.edit = (req, res, resource) => {

    Database.update(resource, req.params.id, req.body).then(() => {
        return updateVersion();
    }).then((version) => {
        res.status(200).send({"version": version});
    }).catch(() => {
        res.sendStatus(500);
    });

};

function updateVersion(resource){

    let promise = new Promise((resolve, reject) => {
        Database.get(resource, "version").then((version) => {
            let newVersion = parseInt(version.version) + 1;
            return Database.update(resource, "version", {"version": newVersion}).then((updateRes) => {
                resolve(newVersion);
            }).catch((err) => {
                reject(err);
            });
        }).catch((err) => {
            reject(err);
        });
    });

    return promise;
}