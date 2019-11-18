/***
 * cuHacking 2020 - Account
 * 
 * This file is responsible for defining the schema and functions for the accounts
 * 
 */

class User {
    constructor(username, role, token){
        this.username = username;
        this.role = role;
        this.token = token;
    }   
}

User.getToken = function(){
    return this.token;
}

User.getUsername = function(){
    return this.username;
}

module.exports = User;