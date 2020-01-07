const express = require('express');
const router = express.Router();
const cors = require('cors')
const ResourceController = require('../controllers/resourceController');
const Authentication = require('../model/authentication');

// Enable CORS
router.options('*', cors());
router.use(cors())

router.get('/', (req, res) => {ResourceController.getAll(req, res, 'map')});
router.get('/version', (req, res) => {ResourceController.getVersion(req, res, 'map')});

router.post('/', Authentication.authenticate("admin"), (req, res) => {ResourceController.add(req, res, 'map')});
router.patch('/:id', Authentication.authenticate("admin"), (req, res) => {ResourceController.edit(req, res, 'map')});

module.exports = router;
