const Database  = require('../model/database');
const User   = require('../model/user');
const UsersController = module.exports;
const Authentication = require('../model/authentication');

const COLLECTION_NAME = 'Users';

const ALLOWED_ORIGIN = 'http://localhost:3000'; 

UsersController.preflight = function(req, res) {

    res.setHeader('Access-Control-Allow-Origin', ALLOWED_ORIGIN); 
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS'); 
    res.setHeader('Access-Control-Allow-Headers', 'authorization, content-type');  
    res.sendStatus(200); 

}


UsersController.create = function(req, res){

    Authentication.getUid(req.body.token).then(function(uid){
        //TODO: Decide on schema for accounts
        let user = {
            "username": req.body.username,
            "role": "user",
            "uid": uid
        }

        Database.add(COLLECTION_NAME, 'uid', user).then(function(dbRes){
            res.status(201).send({
                user: user,
                operation: 'create',
                status: 'success',
                message: 'User successfully created'
            });
        }).catch(function(err){
            res.status(500).send({
                user: user,
                operation: 'create',
                status: 'failure',
                message: err
            })
        });
    }).catch(function(err){
        res.status(500).send({
            user: req.body.username,
            operation: 'create',
            status: 'failure',
            message: err
        });
    });

}


UsersController.delete = function(req, res){

    let uid = req.params.uid;
    let doc = Database.get(COLLECTION_NAME, uid);

    if(!doc){
        res.status(404).send({
            username: username,
            operation: 'delete',
            status: 'failed',
            message: 'User not found'
        });
    } else {
        Database.remove(COLLECTION_NAME, username).then(function(){
            res.status(200).send({
                email: email,
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
    Database.get(COLLECTION_NAME, uid).then(function(databaseResult){

        if(req.user.role != "admin" && req.user.uid !== databaseResult.uid){
            res.status(403).send({
                uid: uid,
                operation: 'get',
                status: 'unauthorized',
                data: 'You are not authorized to view this user'
            });
            return;
        }

        if(databaseResult){
            res.status(200).send({
                uid: uid,
                operation: 'get',
                status: 'success',
                data: databaseResult
            });
        } else {
            res.status(404).send({
                uid: uid,
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
                uid: uid,
                operation: 'update',
                status: 'unauthorized',
                data: 'You are not authorized to update this user'
            });
            return;
        }   
        
        Database.update(COLLECTION_NAME, uid, req.body).then(function(){
            res.status(200).send({
                uid: uid,
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