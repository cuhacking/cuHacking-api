const Database  = require('../model/database');
const Account   = require('../mode;/account');
const AccountController = module.exports;

const COLLECTION_NAME = 'accounts';

const ALLOWED_ORIGIN = 'http://localhost:3000'; 

AccountController.preflight = function(req, res) {

    res.setHeader('Access-Control-Allow-Origin', ALLOWED_ORIGIN); 
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS'); 
    res.setHeader('Access-Control-Allow-Headers', 'authorization, content-type');  
    res.sendStatus(200); 

}


AccountController.create = function(req, res){

    // Decide on schema for accounts
    let account = new Account();

    Database.add(COLLECTION_NAME, 'username', account).then(function(res){
        res.status(201).send({
            account: account,
            operation: 'create',
            status: 'success',
            message: 'Account successfully created'
        });
    }).catch(function(err){
        res.status(500).send({
            account: account,
            operation: 'create',
            status: 'success',
            message: 'Account could not be created in the database'
        })
    });

}


AccountController.delete = function(req, res){

    let username = req.params.username;
    let doc = Database.get(COLLECTION_NAME, username);

    if(!doc){
        res.status(404).send({
            username: username,
            operation: 'delete',
            status: 'failed',
            message: 'Account not found'
        });
    } else {
        Database.remove(COLLECTION_NAME, username).then(function(){
            res.status(204).send({
                email: email,
                operation: 'delete',
                status: 'success',
                message: 'Account successfully deleted' 
            });
        });
    }

}


AccountController.get = function(req, res){

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


AccountController.getByUsername = function(req, res){
    
    let username = req.params.username;
    Database.get(COLLECTION_NAME, username).then(function(databaseResult){

        if(req.user.role != "admin" && req.user.id != databaseResult.id) res.status(403).send({
            username: username,
            operation: 'get',
            status: 'unauthorized',
            data: 'You are not authorized to view this user'
        });

        if(databaseResult){
            res.status(200).send({
                username: username,
                operation: 'get',
                status: 'success',
                data: databaseResult
            });
        } else {
            res.status(404).send({
                username: username,
                operation: 'get',
                status: 'failed',
                message: 'Account not found'
            });
        }
    }).catch(function(err){
        res.status(500).send(err);
    });

}