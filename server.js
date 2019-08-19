const express = require('express');
const PORT = process.env.PORT || 8080; // Use the process's port if given (PaaS), otherwise use 8080
const passport = require('passport');
const Authentication = require('./model/authentication')

const app = express();
const routes = require('./routes/routes');
const mailing_list = require('./routes/mailinglist')

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

// Middleware for handling JSON bodies
app.use(express.json())
app.use(passport.initialize());

Authentication.init();

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