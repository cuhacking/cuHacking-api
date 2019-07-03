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
router.get('/', MailListController.get);
router.get('/:email', MailListController.getByEmail);
router.get('/mailchimp', MailListController.getMailchimp);

router.post('/', MailListController.add);

router.delete('/:email', MailListController.delete);

module.exports = router;