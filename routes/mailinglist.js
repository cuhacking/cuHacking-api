const express   = require('express');
const router    = express.Router();
const Database  = require('../model/database');

router.get('/mailinglist', function(req, res){

});

/**
 * GET /mailinglist
 * 
 * TODO: Decide format/tool for documentation of endpoints
 */
router.post('/mailinglist', function(req, res){

    let email = req.body.email;

    if(validateEmail(email)){
        let data = {
            email: email
        }

        Database.add('mailing_list', email, data).then(function(ref){
            if(ref.id){
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

});

function validateEmail(email){
    //TODO: Validate emails
}

module.exports = router;