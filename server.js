const express = require('express');
const passport = require('passport');
const cors = require('cors');
const Authentication = require('./model/authentication');
const Database = require('./model/database');
const Account = require('./model/account');
const Resource = require('./model/resource');

const app = express();
const routes = require('./routes/routes');
const schedule = require('./routes/schedule');
const updates = require('./routes/updates');
const users = require('./routes/users');
const map = require('./routes/map');
const scan = require('./routes/scan');
const info = require('./routes/info');

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

const admin = require('firebase-admin');
const firebase = require('firebase/app');
const config = require('./config.json');

const env = process.env.NODE_ENV || "development";
const ALLOWED_ORIGIN = config[env].allowed_origin || 'http://localhost:3000';
const PORT = config[env].port || 8080;
const API_ROOT = config[env].api_root;

const serviceAccount = require('./' + config[env].firebase_key_file);

require('firebase/auth');

// Initialize Firebase admin SDK
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: config[env].firebase_url
});

// Inititalize Firebase app SDK
firebase.initializeApp(config[env].firebase_account_config);

// Middleware for handling JSON bodies
app.use(express.json({ limit: '50mb' }));
app.use(passport.initialize());

// Log each request the server receives
app.use('*', (req, res, next) => {
    console.log(`HTTP request received: ${req.method} -> ${req.originalUrl}`)
    console.debug('Request Body:', req.body)
    next()
})

// Log all errors
app.use((error, req, res, next) => {
    console.error('Express error: ', error)
    res.sendStatus(error.status || 500)
})

// Initialize Firebase instances
Authentication.init(admin);
Database.init(admin);
Account.init(firebase, admin);
Resource.init();

// Handle API endpoints
app.use(API_ROOT, routes);
app.use(API_ROOT + '/docs', [basicAuth,swaggerUi.serve], swaggerUi.setup(swaggerDocument));
app.use(API_ROOT + '/schedule/', schedule);
app.use(API_ROOT + '/updates/', updates);
app.use(API_ROOT + '/map/', map);
app.use(API_ROOT + '/info/', info);
app.use(API_ROOT + '/users/', users);
app.use(API_ROOT + '/scan/', scan);

// Start the server
app.listen(PORT, function(){
    console.log('Application server listening on port ' + PORT + " in " + env + " mode using HTTP on " + API_ROOT);
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
