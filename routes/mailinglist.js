const express   = require('express');
const router    = express.Router();
const cors = require('cors');

const config = require('../config.json');
const env = process.env.NODE_ENV || 'development';
const ALLOWED_ORIGIN = config[env].allowed_origin || 'http://localhost:3000';

const MailListController = require('../controllers/mailListController');
const Authentication = require('../model/authentication');

// Enable CORS
const corsOptions = {
  origin: ALLOWED_ORIGIN
};
router.options('*', cors(corsOptions))
router.use(cors(corsOptions))

/**
 * Mailing List Routes
 */
router.get('/:email', Authentication.authenticate("admin"), MailListController.getMailchimp);
router.post('/subscribe', MailListController.add);
router.delete('/:email', Authentication.authenticate("admin"), MailListController.deleteMailchimp);

module.exports = router;