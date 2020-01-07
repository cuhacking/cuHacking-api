const Resource = require('../model/resource');

ResourceController = module.exports;

ResourceController.preflight = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', ALLOWED_ORIGIN); 
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS'); 
  res.setHeader('Access-Control-Allow-Headers', 'authorization, content-type');  
  res.sendStatus(200); 
};

ResourceController.getAll = (req, res, resource) => {
  
    Resource.getAll(resource).then((result) => {
        res.status(200).send(result);
    }).catch(() => {
        res.sendStatus(404)
    });

};

ResourceController.get = (req, res, resource) => {
    
    Resource.get(resource, req.params.id).then((result) => {
        res.status(200).send(result); 
    }).catch(() => {
        res.sendStatus(404);
    });

};

/**
 * Returns the last modified time timestamp of the resource
 */
ResourceController.getVersion = (req, res, resource) => {
    
    Resource.getVersion(resource).then((result) => {
        res.status(200).send(result);
    }).catch(() => {
        res.sendStatus(404);
    });

};

ResourceController.add = (req, res, resource) => {

    Resource.add(resource, req.body).then((result) => {
        res.status(200).send(result);
    }).catch((err) => {
        res.status(500).send(err);
    });

};

ResourceController.edit = (req, res, resource) => {

    Resource.edit(resource, req.params.id, req.body).then(() => {
        res.sendStatus(200);
    }).catch((err) => {
        res.status(500).send(err);
    })

};