const express   = require('express');
const router    = express.Router();
const passport  = require('passport');
// Test route
router.get('/', function(req, res){
    res.send('Response from GET / is successful');
});

module.exports = router;