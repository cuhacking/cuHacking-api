const express = require('express');
const router = express.Router();
const cors = require('cors')
const ResourceController = require('../controllers/resourceController');
const Authentication = require('../model/authentication');

// Enable CORS
router.options('*', cors());
router.use(cors())

router.get('/', (req, res) => {ResourceController.getAll(req, res, 'schedule')});
router.get('/version', (req, res) => {ResourceController.getVersion(req, res, 'schedule')});
router.get('/:id', (req, res) => {ResourceController.get(req, res, 'schedule')});

router.post('/', Authentication.authenticate("admin"), (req, res) => {ResourceController.add(req, res, 'schedule')});
router.patch('/:id', Authentication.authenticate("admin"), (req, res) => {ResourceController.edit(req, res, 'schedule')});

module.exports = router;
