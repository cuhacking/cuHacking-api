const express   = require('express');
const router    = express.Router();

const MailListController = require('../controllers/mailListController')

/**
 * Mailing List Routes
 */


/**
 * GET /mailinglist
 * 
 * TODO: Decide format/tool for documentation of endpoints
 */
router.get('/db', MailListController.get);
router.get('/mailchimp/:email', MailListController.getMailchimp);
router.get('/db/:email', MailListController.getByEmail);


router.post('/subscribe', MailListController.add);

router.delete('/db/:email', MailListController.delete);
router.delete('/mailchimp/:email', MailListController.deleteMailchimp);

module.exports = router;