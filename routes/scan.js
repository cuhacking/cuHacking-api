const express = require('express');
const router = express.Router();
const cors = require('cors')
const ScannerController = require('../controllers/scannerController');
const Authentication = require('../model/authentication');

// Enable CORS
router.options('*', cors());
router.use(cors())

router.post('/', Authentication.authenticate("admin"), ScannerController.scan);

module.exports = router;
