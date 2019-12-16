const express = require('express');
const router = express.Router();
const cors = require('cors')
const ResourceController = require('../controllers/resourceController');
const Authentication = require('../model/authentication');

// Enable CORS
router.options('*', cors());
router.use(cors())

router.get('/', (req, res) => {ResourceController.getAll(req, res, 'Schedule')});
router.get('/:id', (req, res) => {ResourceController.get(req, res, 'Schedule')});
router.get('/version', (req, res) => {ResourceController.getVersion(req, res, 'Schedule')});

router.post('/', Authentication.authenticate("admin"), (req, res) => {ResourceController.add(req, res, 'Schedule')});
router.patch('/:id', Authentication.authenticate("admin"), (req, res) => {ResourceController.edit(req, res, 'Schedule')});

module.exports = router;
