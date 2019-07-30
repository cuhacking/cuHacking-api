const express   = require('express');
const router    = express.Router();
const Database  = require('../model/database');

const MailListController = require('../controllers/mailListController')

/**
 * Mailing List Routes
 */


/**
 * GET /mailinglist
 * 
 * TODO: Decide format/tool for documentation of endpoints
 */
 
router.options('*', MailListController.preflight); 

router.get('/db', MailListController.get);
router.get('/mailchimp/:email', MailListController.getMailchimp);
router.get('/db/:email', MailListController.getByEmail);

router.post('/subscribe', MailListController.add);

router.delete('/db/:email', MailListController.delete);

module.exports = router;