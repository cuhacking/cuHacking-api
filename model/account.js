/***
 * cuHacking 2020 - Account
 * 
 * This file is responsible for interacting with Firebase Auth to manage user logins/accounts
 * 
 */

const Database = require('./database');
const ROLES = {"public": 0, "user": 1, "admin": 2};

let fbAccount, fbAdmin;

var Account = module.exports;

Account.init = function(firebase, admin){
    
    fbAccount = firebase.auth();
    fbAdmin = admin.auth();
    fbAccount.setPersistence(firebase.auth.Auth.Persistence.NONE);
}

Account.create = function(email, password){
    
    let promise = new Promise(function(resolve, reject){
        
        // TODO: consider any email or password validation we want to do at the backend level
        fbAccount.createUserWithEmailAndPassword(email, password).then(function(user){
            resolve(user.user.uid);
        }).catch(function(error){
            reject([error.code, error.message]);
        });

    });

    return promise;

}


Account.signin = function(email, password){ 

    let promise = new Promise(function(resolve, reject){

        fbAccount.signInWithEmailAndPassword(email, password).then(function(){

            return fbAccount.currentUser.getIdToken();

        // }).then(function(token){

        //     const expiry = 1000 * 60 * 60 * 24 * 1; // Last digit is number of days it's valid for
        //     return fbAdmin.createSessionCookie(token.toString(), {expiry});

        // }).then(function(cookie){

        //     const options = {maxAge: expiry, httpOnly: true, secure: true};
        //     resolve([cookie, options])
        }).then(function(token){
            resolve(token);
        }).catch(function(err){
            reject(err);
        });

    });

    return promise;

}


Account.resetPassword = function(email){

    let promise = new Promise(function(resolve, reject){

        fbAccount.sendPasswordResetEmail(email).then(function(res){
            resolve(res);
        }).catch(function(err){
            reject(err);
        });

    });

    return promise;
}


Account.revokeSession = function(token){

    let promise = new Promise(function(resolve, reject){
        fbAdmin.verifyIdToken(token).then(function(decodedToken){
            fbAdmin.revokeRefreshTokens(decodedToken.sub).then(function(res){
                resolve(res);
            }).catch(function(err){
                reject(err);
            });
        });

    });

    return promise;

}


Account.getUid = function(token){

    let promise = new Promise(function(resolve, reject){
        fbAdmin.verifyIdToken(token, true).then(function(decodedToken){
            resolve(decodedToken.uid);
        }).catch(function(err){
            reject("Error verifying token: " + err);
        });
    });

    return promise;
}