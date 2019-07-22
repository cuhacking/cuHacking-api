const express   = require('express');
const router    = express.Router();

const mailing   = require('./mailinglist');

// Test route
router.get('/', function(req, res){
    res.send('Response from GET / is successful');
});

module.exports = router;