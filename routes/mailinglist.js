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

router.post('/', MailListController.add);

module.exports = router;