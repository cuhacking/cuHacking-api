/**
 * cuHacking 2020 - Database
 *  
 * This file is responsible for communicating with the Firestore database. 
 * It defines a set of general operations which can be used to return information to other components.
 * 
 */

 
/**
 * Imports and Setup
 */
let db;

var Database = module.exports;

Database.init = function(admin){
    db = admin.firestore();
}

/**
 * Add data to a collection in the database
 * 
 * @param {string}      collection  - The name of the collection to add to. If the collection does not exist yet, it will be created
 * @param {string}      key         - The name of the variable in the JSON which will be used as a key for the data
 * @param {dictionary}  data        - A JSON Object with the data to be inserted into the database. The data will be inserted as-is
 * 
 * @return {Promise}                - The promise returned by the database's set operation
 */
Database.add = function(collection, key, data){
       
        const dbCollection = db.collection(collection);

        let dbPromise = dbCollection.doc(data[key]).set(data);

        return Promise.all([dbPromise]); // Return the promise from the database operation
    
}


/**
 * Remove an item from a collection in the database
 * 
 * @param {string}      collection  - The name of the collection to delete from
 * @param {Dictionary}  id          - The id of the item to be deleted
 * 
 * @return {Promise}                - The promise returned by the database's delete operation
 */
Database.remove = function(collection, id){

   let dbPromise = db.collection(collection).doc(id).delete();

   return Promise.all([dbPromise]);

}


/**
 * Update a specific document
 * 
 * @param {string}      collection  - The name of the collection containing the item to update
 * @param {stirng}      id          - The id of the item to be updated
 * @param {dictionary}  data        - The data with which to update the item
 */
Database.update = function(collection, id, data){

    let docRef = db.collection(collection).doc(id);
    let updatePromise = docRef.update(data);

    return Promise.all([dbPromise]);

}


/**
 * Get all items from a specific collection in the database
 * 
 * @param {string}      collection  - The name of the collection to get items from
 * @param {int}         limit       - Optional. The max number of items to return. Pass 0 to return all documents. Defaults to 0
 * 
 * @return {Array}                  - An array containing all the items returned by the database
 */
Database.getAll = function(collection, limit=0){

    let promise = new Promise(function(resolve, reject){
        let collectionRef = db.collection(collection);
        let res = [];
        collectionRef.get().then(function(snapshot){
            let counter = 0;
            
            snapshot.forEach(function(doc){
                if(limit !== 0 && counter > limit) return;
                res.push(doc.data());
                counter++;
            });
    
            resolve(res);
        
        }).catch(function(err){
            reject(err);
        });
    });

    return promise;
}


/**
 * Get a specific item by id from a specific collection in the database
 * 
 * @param {string}      collection - The name of the collection to get the item from
 * @param {string}      id         - The id of the item to fetch
 * 
 * @return {Dictionary}            - The item returned from the database
 */
Database.get = function(collection, id){

    let promise = new Promise(function(resolve, reject){
        let collectionRef = db.collection(collection).doc(id);
        collectionRef.get().then(function(doc){
            if(!doc.exists){
                reject("Database get by id: document with id " + id + " in collection " + collection + " not found!");
            } else {
                resolve(doc.data());
            }
        }).catch(function(err){
            reject(err);
        });
    });

    return promise;

}


/**
 * Get items based on a query (e.g. 'name' == 'John')
 * 
 * @param {string}      collection - The name of the collection to get the item from
 * @param {string}      attribute  - The attribute to search by
 * @param {string}      comparison - The comparator to use (e.g. ==, <, >, !=)
 * @param {any}         value      - The value to filter with. Type should match the type stored in the database
 * @param {int}         limit      - Optional. The max number of items to return. Pass 0 to return all documents. Defaults to 0
 * 
 * @return {Array}                 - An array containing all the items returned by the database
 */
Database.getWithQuery = function(collection, limit=0){

    let collectionRef = db.collection(collection);
    let res = [];
    collectionRef.where(attribute, comparison, value).then(function(snapshot){
        let counter = 0;
        
        snapshot.forEach(function(doc){
            if(limit !== 0 && counter > limit) return;
            res.push(doc.data());
        });
    }).catch(function(err){
        return undefined;
    });

    return res;

}


Database.search = function(collection, field, value){

    let promise = new Promise(function(resolve, reject){

        let collectionRef = db.collection(collection);

        collectionRef.where(field, '==', value).get().then(function(snapshot){

            if(snapshot.empty){
                reject("Value does not exist in collection: " + collection);
            }
            
            snapshot.forEach(function(doc){
                resolve(doc.data());
            });

        }).catch(function(err){
            reject(err);
        });
    });

    return promise;

}