const express = require('express');
const PORT = process.env.PORT || 8080; // Use the process's port if given (PaaS), otherwise use 8080
const passport = require('passport');
const Strategy = require('passport-http-bearer').Strategy;
const Database = require('./model/database');

const app = express();
const routes = require('./routes/routes');
const mailing_list = require('./routes/mailinglist')

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

// Middleware for handling JSON bodies
app.use(express.json())
app.use(passport.initialize());

passport.use(new Strategy(function(apikey, done){

    if(!apikey){
        console.log("no api key");
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

app.use(passport.authenticate('bearer'), function(req, res, next){
    console.log(req.originalUrl);
    next();
});

// Handle API endpoints
app.options('*', mailing_list); 

app.use('/', routes);
app.use('/mailinglist/', mailing_list);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Start the server
app.listen(PORT, function(){
    console.log('Application server listening on port ' + PORT + " in " + process.env.NODE_ENV + " mode");
    console.log('hello?'); 
});