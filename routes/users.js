const express   = require('express');
const router    = express.Router();

const UsersController = require('../controllers/usersController');
const Authentication = require('../model/authentication');
const MailListController = require('../controllers/mailListController');

/**
 * Users Routes
 */

 // TODO: Find a better place for this
router.options('*', MailListController.preflight); 

router.get('/', Authentication.authenticate("admin"), UsersController.get);

router.post('/register', UsersController.create);
router.post('/signin', UsersController.signin);
router.post('/signout', UsersController.signout);
router.post('/resetPassword', UsersController.resetPassword);
router.get('/profile', UsersController.getProfile);

router.get('/:uid', Authentication.authenticate("user"), UsersController.getByUid);
router.patch('/:uid', Authentication.authenticate("user"), UsersController.update);
router.delete('/:uid', Authentication.authenticate("admin"), UsersController.delete);

module.exports = router;