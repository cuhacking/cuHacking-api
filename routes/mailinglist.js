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

router.get('/db', Authentication.authenticate("admin"), MailListController.get);
router.get('/mailchimp/:email', Authentication.authenticate("admin"), MailListController.getMailchimp);
router.get('/db/:email', Authentication.authenticate("admin"), MailListController.getByEmail);

router.post('/subscribe', MailListController.add);

router.delete('/db/:email', Authentication.authenticate("admin"), MailListController.delete);
router.delete('/mailchimp/:email', Authentication.authenticate("admin"), MailListController.deleteMailchimp);

module.exports = router;