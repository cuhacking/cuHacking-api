const Database  = require('../model/database');
const Account   = require('../model/account');
const Mail      = require('../model/mail');
const formidable = require('formidable');
const fs        = require('fs');
const Fuse      = require('fuse.js');

const UPLOAD_DIR = __dirname + "/resumes"

const APPLICATION_STATUS = {
    UNSTARTED: 'unstarted',
    UNSUBMITTED: "unsubmitted",
    SUBMITTED: "submitted",
    ACCEPTED1: "accepted-1",
    ACCEPTED2: "accepted-2",
    ACCEPTED3: "accepted-3",
    REVIEWED: "reviewed",
    WAITLIST1: "waitlist-1",
    WAITLIST2: "waitlist-2"
};

const USER_SCHEMA = {
    email: null,
    role: "user",
    uid: null,
    rsvp: {},
    scanned: [],
    application: {
        status: APPLICATION_STATUS.UNSTARTED,
        stage: 1,
        basicInfo: {
            firstName: null, 
            lastName: null,
            gender: null,
            race: null,
            emergencyPhone: null
        },
        personalInfo: {
            school: null,
            major: null,
            minor: null,
            degree: null,
            expectedGraduation: null,
            cityOfOrigin: null,
            tShirtSize: null,
            dietaryRestrictions: {
                halal: false,
                vegetarian: false, 
                lactoseFree: false,
                treeNutFree: false,
                glutenFree: false, 
                other: null 
            },
            wantsShuttle: null
        },
        skills: {
            numHackathons: null,
            selfTitle: null,
            accomplishmentStatement: null,
            challengeStatement: null
        },
        profile: {
            github: null,
            linkedin: null,
            website: null,
            soughtPosition: null,
            resume: null
        },
        terms: {
            codeOfConduct: false,
            privacyPolicy: false,
            under18: false
        }
    }
};

const COLLECTION_NAME = 'Users';
const MAILING_LIST = 'cuhacking';
const UsersController = module.exports;

function createUser(input){
    let user = USER_SCHEMA;
    return Object.assign(user, input); 
}

function modifyUser(user, input){
    return Object.assign(user, input);
}

function getUidFromHeader(header){
    let token = header.split(" ")[1]; // Remove the "Bearer"
    return Account.getUid(token);
}

function validateApplication(app){
    return app.status && Object.values(APPLICATION_STATUS).includes(app.status);
}

function modifyUser(user, input){
    return Object.assign(user, input);
}

UsersController.create = function(req, res){

    Account.create(req.body.email, req.body.password).then(function(uid){
        //TODO: Decide on schema for accounts
        let userData = {
            "email": req.body.email,
            "role": "user",
            "uid": uid
        }

        let user = createUser(userData);
        
        console.log("Account created with email: " + userData.email);
        Database.add(COLLECTION_NAME, 'uid', user).then(function(){
            Account.signin(req.body.email, req.body.password).then(function(token){
                res.status(201).send({
                    user: {
                        email: userData.email,
                        token
                    },
                    operation: 'create',
                    status: 'success',
                    message: 'User successfully created'
                });
            })
        }).catch(function(err){
            console.log("Error with adding to db")
            res.status(500).send({
                user: user,
                operation: 'create',
                status: 'failure',
                message: err
            })
        });
    }).catch(function(err){
        console.log("Error creating account")
        if (err[0] === 'auth/email-already-in-use') {
            console.log('Email in use')
            res.status(409).send({
                message: err[1]
            })
        } else {
            res.status(500).send({
                message: err
            })
        }
    });

}


UsersController.delete = function(req, res){

    let uid = req.params.uid;
    let doc = Database.get(COLLECTION_NAME, uid);

    if(!doc){
        res.status(404).send({
            operation: 'delete',
            status: 'failed',
            message: 'User not found'
        });
    } else {
        Database.remove(COLLECTION_NAME, username).then(function(){
            res.status(200).send({
                operation: 'delete',
                status: 'success',
                message: 'User successfully deleted' 
            });
        });
    }

}


UsersController.get = function(req, res){

    let limit = req.query.limit || 0; // If the limit query is set, use that, otherwise use 0
    Database.getAll(COLLECTION_NAME, limit).then(function(databaseResult){
        for(let item of databaseResult){
            delete item.uid;
        }
        let data = {
            operation: 'get',
            status: 'success',
            items: databaseResult.length,
            data: databaseResult
        };
    
        res.status(200).send(data);
    }).catch(function(err){
        res.status(500).send(err);
    });

}


UsersController.getByEmail = function(req, res){

    let email = req.params.email;
    Database.search(COLLECTION_NAME, 'email', email).then(function(databaseResult){

        if(req.user.role != "admin" && req.user.uid !== databaseResult.uid){
            res.status(403).send({
                operation: 'get',
                status: 'unauthorized',
                data: 'You are not authorized to view this user'
            });
            return;
        }

        if(databaseResult){
            res.status(200).send({
                operation: 'get',
                status: 'success',
                data: databaseResult
            });
        } else {
            res.status(404).send({
                operation: 'get',
                status: 'failed',
                message: 'User not found'
            });
        }
    }).catch(function(err){
        res.status(500).send(err);
    });

}


UsersController.update = function(req, res){

    let uid = req.params.uid;

    Database.get(COLLECTION_NAME, uid).then(function(databaseResult){

        if(req.user.role != "admin" && req.user.uid !== databaseResult.uid){
            res.status(403).send({
                operation: 'update',
                status: 'unauthorized',
                data: 'You are not authorized to update this user'
            });
            return;
        }   
        
        Database.update(COLLECTION_NAME, uid, req.body).then(function(){
            res.status(200).send({
                operation: 'update',
                status: 'success'
            });
        }).catch(function(err){
            res.status(500).send(err);
        });

    }).catch(function(err){
        res.status(500).send(err);
    });


}


UsersController.signin = function(req, res){

    Account.signin(req.body.email, req.body.password).then(function(token){
        res.status(200).send({
            token: token    
        });
    }).catch(error => {
        console.log('Sign in failed, error: ', error)
        res.sendStatus(401)
    });

}


UsersController.signout = function(req, res){

    let auth_header = req.get("authorization"); 
    console.log('signing out: ', auth_header)

    if(auth_header){
        let token = auth_header.split(" ")[1]; // Remove the Bearer
        Account.revokeSession(token).then(function(){
            res.sendStatus(200);
        }).catch(function(err){
            res.status(500).send({
                operation: "signout",
                message: "Failed with error: " + err
            });
        });
    } else {
        res.status(500).send({
            operation: "signout",
            message: "No token provided in header"
        });
    }

}


UsersController.resetPassword = function(req, res){

    Account.resetPassword(req.body.email).then(function(res){
        
        res.status(200).send({
            operation: "resetPassword",
            status: "success",
            message: "Password successfully reset"
        });
    }).catch(function(err){
        res.status(500).send({
            operation: "resetPassword",
            status: "failure",
            message: "Password reset failed"
        });
    });

}


UsersController.getProfile = function(req, res){

    let auth_header = req.get("authorization"); 
    getUidFromHeader(auth_header).then(function(uid){

        Database.get(COLLECTION_NAME, uid).then(function(databaseResult){
        
            if(databaseResult){
                delete databaseResult.uid; // Don't send uid to users
                res.status(200).send({
                    operation: 'get',
                    status: 'success',
                    data: databaseResult
                });
            } else {
                res.status(404).send({
                    operation: 'get',
                    status: 'failed',
                    message: 'User not found'
                });
            }
            
        });

    }).catch(function(err){
        res.status(404).send({
            operation: 'get',
            status: 'failure',
            message: 'Token was invalid'
        });
    });

}

/**
 * Applications
 */

/**
 * Helper function to modify the user's application in the database
 * 
 * @param {String} header - the Authorization header of the request (needed for the token)
 * @param {Object} data - the body of the POST request (i.e. req.body) 
 */
function editApplication(header, data){
    
    let promise = new Promise(function(resolve, reject){

        if(!validateApplication(data)){
            reject({code: 400, message: "Application was invalid"});
        }

        getUidFromHeader(header).then(function(uid){
    
            Database.get(COLLECTION_NAME, uid).then(function(databaseResult){
    
                if(databaseResult){
                    let app = {};
                    if(databaseResult.application){ // If user has application data in their profile
                        app = modifyUser(databaseResult.application, data);
                    } else { // If user has no application data in their profile (this shouldn't happen, except for test accounts)
                        app = modifyUser(USER_SCHEMA.application, data);                   
                    }
    
                    // Save modified user and update database
                    databaseResult.application = app;
    
                    Database.update(COLLECTION_NAME, uid, databaseResult).then(function(){
                        resolve({code: 200, message: "Application successfully saved", uid: uid});
                    }).catch(function(err){
                        reject({code: 500, message: "Application could not be saved due to: " + err});
                    });
                } else {
                    reject({code: 404, message: 'User not found in database'});
                }
                
            }).catch(function(err){
                reject({code: 500, message: "User could not be found due to: " + err});
            });
    
        }).catch(function(err){
            reject({code: 400, message: 'Token was invalid; Message: ' + err})
        });

    });

    return promise;
}

/**
 * Saves the application data to the user's profile
 */
UsersController.saveApplication = function(req, res){

    editApplication(req.get("authorization"), req.body).then(function(result){
        res.sendStatus(result.code);
    }).catch(function(err){
        res.status(err.code).send({
            message: err.message
        });
    });

}

/**
 * Saves the user's application, then handles additional logic which occurs after submitting an application
 * e.g. sending a confirmation
 */
UsersController.submitApplication = function(req, res){

    editApplication(req.get("authorization"), JSON.parse(req.body.form)).then(function(result){
        // Result contains the uid of the user 
        return Database.get(COLLECTION_NAME, result.uid);
    }).then(function(dbRes){
        // This returns the user's profile - we use it to get the email
        return Mail.addTag(MAILING_LIST, dbRes.email, ["applied-1", "2020"]);
    }).then(function(){
        res.sendStatus(200);
    }).catch(function(err){
        console.log('Submit error:', err)
        let errCode = err.code || 500; // Use response code if it's passed down from editApplication, otherwise return a generic 500
        res.status(errCode).send(err);
    });
}


UsersController.getApplication = function(req, res){

    let auth_header = req.get("authorization"); 
    getUidFromHeader(auth_header).then(function(uid){

        Database.get(COLLECTION_NAME, uid).then(function(databaseResult){
        
            // Check that the user has an application
            // They should always have one, except for testing accounts
            if(databaseResult && databaseResult.application){
                res.status(200).send({
                    operation: 'getApplication',
                    status: 'success',
                    data: databaseResult.application
                });
            } else {
                res.status(404).send({
                    operation: 'get',
                    status: 'failed',
                    message: 'User not found'
                });
            }
            
        });

    }).catch(function(err){
        res.status(404).send({
            operation: 'get',
            status: 'failure',
            message: 'Token was invalid'
        });
    });

}

/**
 * Searches for users by full name or email
 * 
 * Req should contain 'name' which has the search term
 */
UsersController.search = function(req, res) {

    let name = req.body.name;
    Database.getAll(COLLECTION_NAME).then(function(result){
        let users = result.map(user => {
            return {
                firstName: user.application.basicInfo.firstName,
                lastName: user.application.basicInfo.lastName,
                name: `${user.application.basicInfo.firstName} ${user.application.basicInfo.lastName}`, 
                email: user.email, 
                uid: user.uid
            };
        });

        // Default options from fuse's site
        const options = {
            shouldSort: true,
            threshold: 0.6,
            location: 0,
            distance: 100,
            maxPatternLength: 32,
            minMatchCharLength: 1,
            keys: [
              "name",
              "email",
              "firstName",
              "lastName"
            ]
          };
        let fuse = new Fuse(users, options);
        let matches = fuse.search(name);
          
        if(matches){
            res.status(200).send(matches);
        } else {
            res.sendStatus(404);
        }
    }).catch(function(err){
        console.log(err);
        res.sendStatus(500);
    });

}