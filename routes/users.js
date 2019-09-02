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
router.get('/:username', Authentication.authenticate("user"), UsersController.getByUsername);

router.post('/', UsersController.create);

router.delete('/:username', Authentication.authenticate("adminm"), UsersController.delete);

module.exports = router;