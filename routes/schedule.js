const express = require('express');
const router = express.Router();
const cors = require('cors')
const ScheduleController = require('../controllers/scheduleController');

// Enable CORS
router.options('*', cors());
router.use(cors())

router.get('/', ScheduleController.getSchedule);
router.get('/:id', ScheduleController.getEvent);
router.get('/version', ScheduleController.getVersion);

router.post('/', ScheduleController.addEvent);
router.patch('/:id', ScheduleController.editEvent);

module.exports = router;
