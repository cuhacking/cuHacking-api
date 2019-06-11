const COLLECTION_NAME = 'mailing_list';

const Database  = require('../model/database');
const MailListController = module.exports;

MailListController.get = function(req, res){
    console.log("GET");
    
    let limit = req.query.limit || 0; // If the limit query is set, use that, otherwise use 0
    Database.getAll(COLLECTION_NAME, limit).then(function(databaseResult){
        let data = {
            items: databaseResult.length,
            data: databaseResult
        };
    
        res.status(200).send(data);
    });

}


MailListController.add = function(req, res){
    console.log(req.body);
    let email = req.body.email;

    if(validateEmail(email)){
        let data = {
            email: email
        }

        Database.add(COLLECTION_NAME, 'email', data).then(function(ref){
            if(ref){
                res.status(201).send({
                    email: email,
                    status: 'success',
                    message: 'Email successfully added to mailing list'
                });
            } else {
                res.status(500).send({
                    email: email,
                    status: 'failed',
                    message: 'Add to mailing list failed on database'
                });
            }
        });
    } else {
        res.status(400).send({
            email: email,
            status: 'failed',
            message: 'Invalid email provided'
        });
    }
}


/**
 * Checks if an email is valid
 * 
 * @param {string}  email - the email to check
 * 
 * @return {boolean}      - a boolean indicating whether the email is valid        
 */
function validateEmail(email){
    // Extremely rudimentary validation for now
    return email.includes("@") && email.includes(".");
}
