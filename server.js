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
const PORT = process.env.PORT || (env === "development" ? 8080 : 8081); 

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

app.use('/api', routes);
app.use('/api/mailinglist/', mailing_list);
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/api/users/', users);

// Use HTTPS for production
if(process.env.NODE_ENV === "production"){
    const options = {
        key: fs.readFileSync(config.ssl_key),
        cert: fs.readFileSync(config.ssl_cert)
      };
      
    https.createServer(options, app).listen(PORT, function(){
        console.log('Application server listening on port ' + PORT + " in " + process.env.NODE_ENV + " mode using HTTPS");
    });
} else {
    // Start the server
    app.listen(PORT, function(){
        console.log('Application server listening on port ' + PORT + " in " + process.env.NODE_ENV + " mode using HTTP");
    });
}