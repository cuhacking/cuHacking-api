const express = require('express');
const router = express.Router();
const UpdatesController = require('../controllers/updatesController');

router.options('*', UpdatesController.preflight);

router.get('/', UpdatesController.getUpdates);

module.exports = router;
