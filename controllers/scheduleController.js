const generateId = require('shortid') // We're going to need this for creating the schedule
const Schedule = require('../model/schedule');
const Database = require('../model/database');

const COLLECTION_NAME = "Schedule";

ScheduleController = module.exports;

ScheduleController.preflight = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', ALLOWED_ORIGIN); 
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS'); 
  res.setHeader('Access-Control-Allow-Headers', 'authorization, content-type');  
  res.sendStatus(200); 
};

ScheduleController.getSchedule = (req, res) => {
  
  Database.getAll(COLLECTION_NAME).then((scheduleObject) => {
    scheduleObject.version = scheduleObject.version.version; // Get version to the top-level
    res.status(200).json(scheduleObject);
  }).catch((err) => {
    res.sendStatus(500);
  });

};

ScheduleController.getEvent = (req, res) => {
    
    Database.get(COLLECTION_NAME, req.params.id).then((event) => {
        res.status(200).json(event);
    }).catch((err) => {
        res.sendStatus(404);
    });

};

ScheduleController.getVersion = (req, res) => {

    Database.get(COLLECTION_NAME, "version").then((versionObj) => {
        res.status(200).json(versionObj.version);
    });

};

ScheduleController.addEvent = (req, res) => {

    let id = generateId.generate();
    // Need to do this since database model gets the key from the data
    // TODO: refactor so that the key doesn't need to be in the data
    req.body['id'] = id;
    Database.add(COLLECTION_NAME, 'id', req.body).then(() => {
        return updateVersion();
    }).then((version) => {
        res.status(200).json({"version": version, "id": id});
    }).catch((err) => {
        res.sendStatus(500);
    });

};

ScheduleController.editEvent = (req, res) => {

    Database.update(COLLECTION_NAME, req.params.id, req.body).then(() => {
        return updateVersion();
    }).then((version) => {
        res.status(200).send({"version": version});
    }).catch(() => {
        res.sendStatus(500);
    });

};

function updateVersion(){

    let promise = new Promise((resolve, reject) => {
        Database.get(COLLECTION_NAME, "version").then((version) => {
            let newVersion = parseInt(version.version) + 1;
            return Database.update(COLLECTION_NAME, "version", {"version": newVersion}).then((updateRes) => {
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