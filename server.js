const express = require('express');
const passport = require('passport');
const Authentication = require('./model/authentication');
const Database = require('./model/database');
const http = require('http');
const https = require('https');

const app = express();
const routes = require('./routes/routes');
const mailing_list = require('./routes/mailinglist');
const users = require('./routes/users');

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

const admin    = require('firebase-admin');
const config   = require('./config.json');  

const env = process.env.NODE_ENV || "development";
const PORT = config[env].port;
const API_ROOT = config[env].api_root;

const serviceAccount = require('./' + config[env].firebase_key_file);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: config[env].firebase_url
});

// Middleware for handling JSON bodies
app.use(express.json())
app.use(passport.initialize());

Authentication.init(admin);
Database.init(admin);

// Handle API endpoints
app.options('*', mailing_list); 

app.use(API_ROOT, routes);
app.use(API_ROOT + '/mailinglist/', mailing_list);
app.use(API_ROOT + '/docs', [basicAuth,swaggerUi.serve], swaggerUi.setup(swaggerDocument));
app.use(API_ROOT + '/users/', users);

// Start the server
app.listen(PORT, function(){
    console.log('Application server listening on port ' + PORT + " in " + process.env.NODE_ENV + " mode using HTTP on " + API_ROOT);
});


// Extremely basic auth for the documentation while waiting for full authentication
// TODO: Replace/remove this    
function basicAuth(req, res, next){

    const auth = { username: config[env].credentials.username, password: config[env].credentials.password };

    if(!req.headers.authorization){
        res.set('WWW-Authenticate', 'Basic realm="You must be logged in to view this page."');
        res.status(401).send('Please log in to view this page.');
        return;
    }

    const base64Credentials =  req.headers.authorization.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [username, password] = credentials.split(':');

    if(username && password && username == auth.username && password == auth.password) return next();

    res.set('WWW-Authenticate', 'Basic realm="You must be logged in to view this page."');
    res.status(401).send('Please log in to view this page.');

}
