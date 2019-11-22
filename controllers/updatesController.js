const generateId = require('shortid') // We're going to need this for making announcements
const Updates = require('../model/updates');

UpdatesController = module.exports;

UpdatesController.preflight = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', ALLOWED_ORIGIN); 
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS'); 
  res.setHeader('Access-Control-Allow-Headers', 'authorization, content-type');  
  res.sendStatus(200); 
};

UpdatesController.getUpdates = (req, res) => {
  const updatesObject = Updates.get();
  return res.status(200).json(updatesObject);
};
