const generateId = require('shortid') // We're going to need this for creating the resource
const Database = require('../model/database');
const fs = require('fs');
const path = require('path');

const FILE_NAMES = {
    Schedule: "schedule.json",
    Updates: "updates.json",
    Map: "map.json"
};

let values = {
    Schedule: {},
    Updates: {},
    Map: {}
};

ResourceController = module.exports;

ResourceController.preflight = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', ALLOWED_ORIGIN); 
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS'); 
  res.setHeader('Access-Control-Allow-Headers', 'authorization, content-type');  
  res.sendStatus(200); 
};

/**
 * Inititalizes the resource controller
 * Sets up file watchers for each of the json files
 * 
 */
ResourceController.init = () => {

    for(let resource in FILE_NAMES){
        let filename = path.resolve(__dirname, '..', FILE_NAMES[resource]);
        
        // Load any initial data
        fs.readFile(filename, (err, data) => {
            if(err) {

                if(err.code === 'ENOENT'){
                    // File doesn't exist - create it
                    console.log(`File ${filename} does not exist, creating it...`);
                    fs.writeFile(filename, JSON.stringify({}), (err) => {
                        if(err) console.log(`Error creating file ${filename}`);

                        console.log(`Watching ${filename} for resource ${resource}`);
                        fs.watchFile(filename, (curr, prev) => {
                            console.log(`Update found for file ${filename}`);
                            fs.readFile(filename, (err, data) => {
                                if(err) throw err;
                                values[resource] = JSON.parse(data);
                            });
                        });
                    })

                } else {
                    throw err;
                }
                
            } else {
                // FIle exists - read it
                values[resource] = JSON.parse(data);
                console.log(`Watching ${filename} for resource ${resource}`);
                fs.watchFile(filename, (curr, prev) => {
                    console.log(`Update found for file ${filename}`);
                    fs.readFile(filename, (err, data) => {
                        if(err) throw err;
                        values[resource] = JSON.parse(data);
                    });
                });
            }
            
        });
    }       

}

ResourceController.getAll = (req, res, resource) => {
  
  if(values[resource]){
      res.status(200).send(values[resource]);
  } else {
      res.sendStatus(404);
  }

};

ResourceController.get = (req, res, resource) => {
    
    if(values[resource]){
        if(req.params.id in values[resource]){
            res.status(200).send(values[resource][req.params.id]);
            return;
        }
    }
    res.sendStatus(404);

};

/**
 * Returns the last modified time timestamp of the resource
 */
ResourceController.getVersion = (req, res, resource) => {
    
    fs.stat(FILE_NAMES[resource], (err, stats) => {
        if(err) {
            console.log(`Error stating file ${FILE_NAMES[resources]}; Error: ${err}`);
        }
        res.status(200).send(stats.mtime);
    });

};

ResourceController.add = (req, res, resource) => {

    let id = generateId.generate();
    values[resource][id] = req.body;
    fs.writeFile(FILE_NAMES[resource], JSON.stringify(values[resource]), (err) => {
        if(err) res.status(500).send(err);
        res.status(200).send({
            id: id,
            body: req.body
        });
    });

};

ResourceController.edit = (req, res, resource) => {

    let id = req.params.id;
    values[resource][id] = Object.assign(values[resource][id], req.body);
    fs.writeFile(FILE_NAMES[resource], JSON.stringify(values[resource]), (err) => {
        if(err) res.status(500).send(err);
        res.sendStatus(200);
    });

};