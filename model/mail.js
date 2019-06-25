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
const config = require('../config.json');

const Mailchimp = require('mailchimp-api-v3');
const mailchimp = new Mailchimp(config.mailchimp_api_key);
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
                "company":  "cuHacking",
                "address1": "address",
                "city":     "Ottawa",
                "state":    "Ontario",
                "zip":      "zip",
                "country":  "Canada"
            },
            "permission_reminder": "You're receiving this email because you signed up for cuHacking 2020's mailing list.",
            "campaign_defaults":{
                "from_name":    "cuHacking",
                "from_email":   "noreply@cuhacking.com",
                "subject":      "cuHacking",
                "language":     "English"
            },
            "email_type_option": false
        };
        mailchimp.post('/lists', list_settings).then(function(res){
            resolve(res); 
        }, function(error){
            reject(error);
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
 * @param {string}      list    - The name of the list to add the email to. Creates list if it does not exist
 * @param {string}      email   - The email to add to the mailing list
 * 
 * @return {Promise}            - Promise returns the response from the add operation
 */
Mail.subscribe = function(list, email){
    
    let promise = new Promise(function(resolve, reject){
        Mail.getList(list).then(function(res_list){
            if(res_list.id){

                mailchimp.post('/lists/' + res_list.id + '/members', {
                    "email_address": email,
                    "status": "subscribed"
                }).then(function(res){
                   resolve(res); 
                });

            } else {
                
                // If the list does not exist, create it and use it
                Mail.createList(list).then(function(create_res){
                    if(create_res.id){
                        mailchimp.post('/lists/' + create_res.id + '/members', {
                            "email_address": email,
                            "status": "subscribed"
                        }).then(function(res){
                           resolve(res); 
                        });
                    }
                }, function(create_error){
                    reject("Error creating list");
                });

            }
        }, function(error){
            reject("Getting list failed");
        });
    });

    return promise;
}
