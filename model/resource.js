const generateId = require('shortid') // We're going to need this for creating the resource
const fs = require('fs');
const path = require('path');

const FILE_NAMES = {
    schedule: "schedule.json",
    updates: "updates.json",
    map: "map.json",
    info: "info.json"
};

let values = {
    schedule: {version: -1, schedule: {}},
    updates: {version: -1, updates: {}},
    map: {version: -1, map: {}},
    info: {version: -1, info: {}}
};

Resource = module.exports;

/**
 * Inititalizes the resource controller
 * Sets up file watchers for each of the json files
 * 
 */
Resource.init = () => {

    for(let resource in FILE_NAMES){
        let filename = path.resolve(__dirname, '..', FILE_NAMES[resource]);
        
        // Load any initial data
        fs.readFile(filename, (err, data) => {
            if(err) {

                if(err.code === 'ENOENT'){
                    // File doesn't exist - create it
                    console.log(`File ${filename} does not exist, creating it...`);
                    fs.writeFile(filename, JSON.stringify(values[resource]), (err) => {
                        if(err) console.log(`Error creating file ${filename}`);

                        console.log(`Watching ${filename} for resource ${resource}`);
                        fs.watchFile(filename, (curr, prev) => {
                            console.log(`Update found for file ${filename}`);
                            fs.readFile(filename, (err, data) => {
                                if(err) throw err;
                                values[resource] = JSON.parse(data);

                                fs.stat(filename, (err, stats) => {
                                   values[resource]["version"] = stats.mtime; 
                                });
                            });
                        });
                    })

                } else {
                    throw err;
                }
                
            } else {
                // File exists - read it
                values[resource] = JSON.parse(data);
                console.log(`Watching ${filename} for resource ${resource}`);
                fs.watchFile(filename, (curr, prev) => {
                    console.log(`Update found for file ${filename}`);
                    fs.readFile(filename, (err, data) => {
                        if(err) throw err;
                        values[resource] = JSON.parse(data);

                        fs.stat(filename, (err, stats) => {
                            values[resource]["version"] = stats.mtime; 
                         });
                    });
                });
            }
            
        });
    }       

}

/**
 * Get all the items of a resource
 * 
 * @param {String} resource - The resource to update
 * 
 */
Resource.getAll = (resource) => {
  
    let promise = new Promise((resolve, reject) => {
        if(values[resource]) {
            resolve(values[resource])
        } else {
            reject("Not found");
        }
    });

    return promise;

};

/**
 * Get a specific resource item
 * 
 * @param {String} resource - The resource to update
 * @param {String} id       - Id of the item to get
 */
Resource.get = (resource, id) => {
    
    let promise = new Promise((resolve, reject) => { 
        if(values[resource][resource]){
            if(id in values[resource][resource]){
                resolve(values[resource][resource][id]);
            }
        }
        reject("Not found");
    });

    return promise;

};

/**
 * Returns the last modified time timestamp of the resource
 * 
 * @param {String} resource - The resource to update
 */
Resource.getVersion = (resource) => {
    
    let promise = new Promise((resolve, reject) => {
        fs.stat(FILE_NAMES[resource], (err, stats) => {
            if(err) {
                console.log(`Error stating file ${FILE_NAMES[resources]}; Error: ${err}`);
                reject(err);
            }
            resolve({"version": stats.mtime});
        });
    });

    return promise;

};

/**
 * Add a new item to the resource
 * 
 * @param {String} resource - The resource to update
 * @param {Object} body     - The values for the new resource (i.e. body of POST)
 * 
 */
Resource.add = (resource, body) => {

    let promise = new Promise((resolve, reject) => {
        let id = generateId.generate();
        body["id"] = id;
        values[resource][resource][id] = body;
        fs.stat(FILE_NAMES[resource], (err, stats) => {
            values[resource]["version"] = stats.mtime; 

            fs.writeFile(FILE_NAMES[resource], JSON.stringify(values[resource]), (err) => {
                if(err) reject(err);
                resolve({
                    id: id,
                    body: body
                });
            });
         });
    });

    return promise;

};

/**
 * Modify a resource item
 * 
 * @param {String} resource - The resource to update
 * @param {String} id       - The id of the item to modify
 * @param {Object} body     - The values to update
 * 
 */
Resource.edit = (resource, id, body) => {

    let promise = new Promise((resolve, reject) => {
        values[resource][resource][id] = Object.assign(values[resource][resource][id], body);

        fs.stat(FILE_NAMES[resource], (err, stats) => {
            values[resource]["version"] = stats.mtime;
            fs.writeFile(FILE_NAMES[resource], JSON.stringify(values[resource]), (err) => {
                if(err) reject(err);
                resolve({
                    id: id,
                    body: body
                });
            }); 
        });

    });

    return promise;

};