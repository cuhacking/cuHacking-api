const express   = require('express');
const router    = express.Router();
const passport  = require('passport');
// Test route
router.get('/', function(req, res){
    res.send('Response from GET / is successful');
});

router.post('/login', function(req, res){
    passport.authenticate('bearer');
});

router.get('/logout', function(req, res){
    req.logout();
});

module.exports = router;