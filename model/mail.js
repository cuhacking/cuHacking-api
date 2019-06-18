/**
 * cuHacking 2020 - Mailing
 *  
 * This file is responsible for communicating with the Mailchimp API
 * It defines a set of general operations which can be used to return information to other components.
 * 
 */


 /**
 * Imports and Setup
 */
const Mailchimp = require('mailchimp-api-v3');
const mailchimp = new Mailchimp('API-KEY-HERE');
const crypto = require('crypto');

var Mail = module.exports;


/**
 * Create a new mailing list
 * 
 * @param {string}      name - The name of the list to create
 * 
 * @return {Promise}         - Promise returns the result of the create operation
 */
Mail.createList = function(name){

    let promise = new Promise(function(resolve, reject){
        // Maybe use a config file for these reminders?
        let list_settings = {
            "name": name,
            "contact":  {
                
            },
            "permission_reminder": "You're receiving this email because you signed up for cuHacking 2020's mailing list.",
            "campaign_defaults":{

            },
            "email_type_option": false
        };
        mailchimp.post('/lists', list_settings).then(function(res){
            resolve(res); //TODO: Check the response for errors and reject the promise
        });
    });

    return promise;
}


/**
 * Get a specific list from Mailchimp
 * 
 * @param {string}      name - The name of the list to get
 * 
 * @return {Promise}         - Promise returns the list object received from Mailchimp
 */
Mail.getList = function(name){

    let promise = new Promise(function(resolve, reject){
        mailchimp.get('/lists').then(function(res){
            for(let list of res.lists){
                if(list.name === name){
                    resolve(list);
                }
            }

            reject("List was not found");
        });
    });

    return promise;
}


/**
 * Subscribe a user to a mailing list
 * 
 * @param {string}      list    - The name of the list to add the email to
 * @param {string}      email   - The email to add to the mailing list
 * 
 * @return {Promise}            - Promise returns the response from the add operation
 */
Mail.subscribe = function(list, email){
    
    let promise = new Promise(function(resolve, reject){
        let list_id = Mail.getList(list).id;

        if(list_id){
            mailchimp.post('/lists/' + list_id + '/members', {
                "email_address": email,
                "status": "subscribed"
            }).then(function(res){
               resolve(res); 
            });
        } else {
            reject("List was not found");
        }
    });

    return promise;
}
