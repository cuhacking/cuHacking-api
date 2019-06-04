const express = require('express');
const PORT = process.env.PORT || 8080; // Use the process's port if given (PaaS), otherwise use 8080

const app = express();
const routes = require('src/routes');

// Handle API endpoints
app.use(routes);

// Start the server
app.listen(PORT, function(){
    console.log('Application server listening on port ' + PORT);
});