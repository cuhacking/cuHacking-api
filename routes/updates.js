const express = require('express');
const router = express.Router();
const cors = require('cors')

const UpdatesController = require('../controllers/updatesController');

// Enable CORS
router.options('*', cors());
router.use(cors())

router.get('/', UpdatesController.getUpdates);

module.exports = router;
