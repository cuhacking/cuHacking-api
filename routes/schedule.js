const express = require('express');
const router = express.Router();
const ScheduleController = require('../controllers/scheduleController');

router.options('*', ScheduleController.preflight);

router.get('/', ScheduleController.getSchedule);
router.get('/:id', ScheduleController.getEvent);

module.exports = router;
