const express = require('express');
const router = express.Router();
const cors = require('cors')
const ResourceController = require('../controllers/resourceController');
const Authentication = require('../model/authentication');

// Enable CORS
router.options('*', cors());
router.use(cors())

router.get('/', (req, res) => {ResourceController.getAll(req, res, 'Updates')});
router.get('/version', (req, res) => {ResourceController.getVersion(req, res, 'Updates')});
router.get('/:id', (req, res) => {ResourceController.get(req, res, 'Updates')});

router.post('/', Authentication.authenticate("admin"), (req, res) => {ResourceController.add(req, res, 'Updates')});
router.patch('/:id', Authentication.authenticate("admin"), (req, res) => {ResourceController.edit(req, res, 'Updates')});

module.exports = router;
``