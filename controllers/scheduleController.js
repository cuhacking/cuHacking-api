const generateId = require('shortid') // We're going to need this for creating the schedule
const Schedule = require('../model/schedule');

ScheduleController = module.exports;

ScheduleController.preflight = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', ALLOWED_ORIGIN); 
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS'); 
  res.setHeader('Access-Control-Allow-Headers', 'authorization, content-type');  
  res.sendStatus(200); 
};

ScheduleController.getSchedule = (req, res) => {
  const scheduleObject = Schedule.all();
  return res.status(200).json(scheduleObject);
};

ScheduleController.getEvent = (req, res) => {
  const event = Schedule.getEvent(req.params.id)

  if (event)
    return res.status(200).json(event);
  else
    return res.sendStatus(404);
};
