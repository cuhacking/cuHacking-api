const express   = require('express');
const router    = express.Router();
const Authentication = require('../model/authentication');
// Test route
router.get('/', function(req, res){
    res.send('Response from GET / is successful');
});

router.get('/test-user-auth', Authentication.authenticate("user"), function(){
    res.send('User authentication is successful');
});

router.get('/test-admin-auth', Authentication.authenticate("admin"), function(){
    res.send('Admin authentication is successful');
});

module.exports = router;