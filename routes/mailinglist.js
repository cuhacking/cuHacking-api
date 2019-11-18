const express   = require('express');
const router    = express.Router();

const MailListController = require('../controllers/mailListController');
const Authentication = require('../model/authentication');

/**
 * Mailing List Routes
 */


/**
 * GET /mailinglist
 * 
 * TODO: Decide format/tool for documentation of endpoints
 */
 
router.options('*', MailListController.preflight); 

router.get('/:email', Authentication.authenticate("admin"), MailListController.getMailchimp);
router.post('/subscribe', MailListController.add);
router.delete('/:email', Authentication.authenticate("admin"), MailListController.deleteMailchimp);

module.exports = router;