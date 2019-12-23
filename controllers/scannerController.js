const Database  = require('../model/database');
const Account   = require('../model/account');

const COLLECTION_NAME = 'Users';
const ScannerController = module.exports;

/**
 *  Handles response to scanning a QR code
 */
ScannerController.scan = function(req, res){

    let uid = req.body.uid;
    let eventId = req.body.eventId;

    Database.get(COLLECTION_NAME, uid).then(function(user){

        let scanned = [];
        if(user.scanned){
            scanned = user.scanned;
            if(scanned.includes(eventId)){
                return res.status(400).send("User has already been scanned for this event")
            }
        }
        scanned.push(eventId);

        Database.update(COLLECTION_NAME, uid, {"scanned": scanned}).then(function(){
            res.sendStatus(200);
        }).catch(function(err){
            console.log("Scanning failed with error: " + err);
            res.sendStatus(500);
        });
        
    }).catch(function(err){
        console.log(err)
        res.sendStatus(404);
    });

}
