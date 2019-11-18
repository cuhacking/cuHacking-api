const Database  = require('../model/database');
const Account   = require('../model/account');
const User      = require('../model/user');
const UsersController = module.exports;

const COLLECTION_NAME = 'Users';

UsersController.create = function(req, res){

    Account.create(req.body.email, req.body.password).then(function(uid){
        //TODO: Decide on schema for accounts
        let userData = {
            "email": req.body.email,
            "role": "user",
            "uid": uid
        }

        let user = User.create(userData);
        
        console.log("Account created with email: " + userData.email);
        Database.add(COLLECTION_NAME, 'uid', user).then(function(){
            res.status(201).send({
                user: userData.email,
                operation: 'create',
                status: 'success',
                message: 'User successfully created'
            });
        }).catch(function(err){
            console.log("Error with adding to db")
            res.status(500).send({
                user: user,
                operation: 'create',
                status: 'failure',
                message: err
            })
        });
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
    });

}


UsersController.signout = function(req, res){

    let auth_header = req.get("authorization"); 

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

    if(auth_header){
        let token = auth_header.split(" ")[1]; // Remove the Bearer
        Account.getUid(token).then(function(uid){

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

}