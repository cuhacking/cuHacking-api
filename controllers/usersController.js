const Database  = require('../model/database');
const Account   = require('../model/account');
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

function getUidFromHeader(header){
    let token = header.split(" ")[1]; // Remove the "Bearer"
    return Account.getUid(token);
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


UsersController.getByUid = function(req, res){

    let uid = req.params.uid;
    Database.search(COLLECTION_NAME, 'uid', uid).then(function(databaseResult){

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