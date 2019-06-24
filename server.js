const express = require('express');
const PORT = process.env.PORT || 8080; // Use the process's port if given (PaaS), otherwise use 8080

const app = express();
const routes = require('./routes/routes');
const mailing_list = require('./routes/mailinglist')

// Middleware for handling JSON bodies
app.use(express.json())

// Handle API endpoints
app.use('/', routes);
app.use('/mailinglist/', mailing_list);

// Catch any other request and return a 404
app.all('*', function(req, res){
    res.sendStatus(404);
}); 

// Start the server
app.listen(PORT, function(){
    console.log('Application server listening on port ' + PORT);
});