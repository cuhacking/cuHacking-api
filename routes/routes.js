const express   = require('express');
const router    = express.Router();

// Test route
router.get('/', function(req, res){
    res.send('Response from GET / is successful');
});

module.exports = router;