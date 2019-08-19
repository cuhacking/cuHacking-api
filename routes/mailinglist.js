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

router.get('/db', Authentication.authenticate, MailListController.get);
router.get('/mailchimp/:email', MailListController.getMailchimp);
router.get('/db/:email', MailListController.getByEmail);

router.post('/subscribe', MailListController.add);

router.delete('/db/:email', MailListController.delete);
router.delete('/mailchimp/:email', MailListController.deleteMailchimp);

module.exports = router;