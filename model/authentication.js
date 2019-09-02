const passport = require('passport');
const Strategy = require('passport-http-bearer').Strategy;
const Database = require('./database');
const bcrypt = require('bcrypt');
const ROLES = {"public": 0, "user": 1, "admin": 2};

let fbAuth;

var Authentication = module.exports;

Authentication.init = function(admin){

    fbAuth = admin.auth();

    passport.use(new Strategy(function(apikey, done){

        if(!apikey){
            console.log("No api key provided");
            return done(null, false);
        }

        Authentication.getUid(apikey).then(function(uid){

            Database.search('Users', 'uid', uid).then(function(res){
                if(!res) {
                    return done(null, false);
                }
                
                return done(null, res);
            }).catch(function(err){
                console.log("Error in auth:" + err);
                return done(null, false);
            });

        }).catch(function(error){
            console.log("Error verifying token");
            return done(null, false);
        });
    

    
    }));
}

Authentication.authenticate = function(role){

    return [passport.authenticate('bearer'), function(req, res, next){
 
        if(req.user && ROLES[req.user.role] < ROLES[role]) {
            res.sendStatus(403);
            console.log("insufficient role");
            return;
        }

        next();
    }]
};

passport.serializeUser(function(user, cb) {
    cb(null, user.uid);
});

passport.deserializeUser(function(uid, cb) {

    Database.search('accounts', 'uid', uid).then(function(res){

        if(!res) {
            return cb(null);
        }
    
        return cb(null, res);
    }).catch(function(err){
        return cb(err);
    });

});

Authentication.getUid = function(token){
    
    let promise = new Promise(function(resolve, reject){
        fbAuth.verifyIdToken(token).then(function(decodedToken){
            resolve(decodedToken.uid);
        }).catch(function(err){
            reject("Error verifying token: " + err);
        });
    });

    return promise;
}