const Mail = require('../model/mail');
const config   = require('../config.json');  
const MailListController = module.exports;

const MAILING_LIST = 'cuhacking';

const env = process.env.NODE_ENV || "development";
const ALLOWED_ORIGIN = config[env].allowed_origin || 'http://localhost:8080'; 

MailListController.preflight = function(req, res) {

    res.setHeader('Access-Control-Allow-Origin', ALLOWED_ORIGIN); 
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS'); 
    res.setHeader('Access-Control-Allow-Headers', 'authorization, content-type');  
    res.sendStatus(200); 

}


MailListController.add = function(req, res){

    let email = req.body.email;

    // TODO: Is there some better place/way to do this? The MDN indicates we need 
    // to set this header on both the preflight request and the actual, _real_ request. 
    res.setHeader('Access-Control-Allow-Origin', ALLOWED_ORIGIN); 

    if(validateEmail(email)){

        console.log("Adding email to Mailchimp: " + email);
        // Add to database succeeded, now add to Mailchimp
        Mail.subscribe(MAILING_LIST, email).then(function(mailchimpRes){
            res.status(201).send({
                email: email,
                operation: 'add',
                status: 'success',
                message: 'Email successfully added to mailing list'
            });
        }).catch(function(error){
            res.status(500).send({
                email: email,
                operation: 'add',
                status: 'failed',
                message: 'Failed to add email to Mailchimp. Reason: ' + error
            });
        });

    } else {
        res.status(400).send({
            email: email,
            operation: 'add',
            status: 'failed',
            message: 'Invalid email provided'
        });
    }
}


MailListController.getMailchimp = function(req, res){

    let email = req.params.email;
    Mail.getUser(MAILING_LIST, email).then(function(user){
        res.status(200).send({
            email: email,
            operation: 'get',
            status: 'success',
            result: user
        });
    }).catch(function(error){
        if(error.status === 404){
            res.status(404).send({
                email: email,
                operation: 'get',
                status: 'failed',
                message: 'User not found in Mailchimp'
            })
        }
    });
    
}


MailListController.deleteMailchimp = function(req, res){

    let email = req.params.email;
    Mail.unsubscribe(MAILING_LIST, email).then(function(user){
        res.status(204).send({
            email: email,
            operation: 'delete',
            status: 'success',
            message: 'Email successfully deleted' 
        });
    }).catch(function(error){
        if(error.status === 404){
            res.status(400).send({
                email: email,
                operation: 'get',
                status: 'failed',
                message: 'User not found in Mailchimp'
            });
        } else {
            res.status(500).send({
                email: email,
                operation: 'delete',
                status: 'failed',
                message: 'delete failed for unknown reason'
            })
        }
    });

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
