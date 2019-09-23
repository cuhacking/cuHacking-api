const express   = require('express');
const router    = express.Router();

const MailListController = require('../controllers/mailListController');
const Authentication = require('../model/authentication');
const ResourceController = require('../controller.  ')

/**
 * Mailing List Routes
 */


/**
 * GET /mailinglist
 * 
 * TODO: Decide format/tool for documentation of endpoints
 */
 
router.options('*', MailListController.preflight); 

router.get('/version', ResourceController.getVersions);

router.post('/:resource', Authentication.authenticate("admin"), ResourceController.createResource);
router.get('/:resource', ResourceController.getResource);
router.patch('/:resource', Authentication.authenticate("admin"), ResourceController.updateResource);

/*
router.post('/map', ResourceController.createMap);
router.get('/map', ResourceController.getMap);
router.patch('/map', ResourceController.updateMap);

router.post('/schedule', ResourceController.createSchedule);
router.get('/schedule', ResourceController.getSchedule);
router.patch('/schedule', ResourceController.updateSchedule);
*/

module.exports = router;