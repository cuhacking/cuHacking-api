const passport = require('passport');
const Strategy = require('passport-http-bearer').Strategy;
const Database = require('./database');
const bcrypt = require('bcrypt');
const ROLES = {"public": 0, "user": 1, "admin": 2};

var Authentication = module.exports;

Authentication.init = function(){
    passport.use(new Strategy(function(apikey, done){

        if(!apikey){
            console.log("No api key provided");
            return done(null, false);
        }
    
        Database.search('Authorization', 'apikey', apikey).then(function(res){
            if(!res) {
                return done(null, false);
            }
            
            return done(null, res);
        }).catch(function(err){
            console.log("Error in auth:" + err);
            return done(null, false);
        });
    
    }));
}

Authentication.authenticate = function(role){
    return function(req, res, next){
        if(!req.isAuthenticated()) res.sendStatus(401);
        if(ROLES[req.user.role] < ROLES[role]) res.sendStatus(403);
        
        next();
    }
};

passport.serializeUser(function(user, cb) {
    cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {

    Database.search('Authorization', id).then(function(res){

        if(!res) {
            return cb(null);
        }
    
        return cb(null, res);
    }).catch(function(err){
        return cb(err);
    });

});