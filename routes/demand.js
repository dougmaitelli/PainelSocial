var express = require('express');
var config = require('../config');
var jwt = require("jsonwebtoken");
var router = express.Router();

var app = express();

app.set('SECRET', (process.env.SECRETS || config.secret));

var Demand = require('../models/Demand.js');
var Comment = require('../models/Comment.js');
var Images = require('../models/Image.js');

router.use(function(req, res, next) {
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  if (token) {
    jwt.verify(token, app.get('SECRET'), function(err, decoded) {
      if (err) { return res.json({ success: false, message: 'Failed to authenticate token.', err: err }); }
      else { req.decoded = decoded; next(); }
    });
  } else {
    return res.status(403).send({ success: false, message: 'No token provided.' });
  }
});

router.get('/', function(req, res, next){
  Demand.find(function(err, demands){
    if (err) return console.error(err);
    res.json({type: true, data: demands});
  });
});

router.post('/', function(req, res, next){

  var demandModel = new Demand();
  demandModel.description = req.body.description;
  demandModel.longitude = req.body.longitude;
  demandModel.latitude = req.body.latitude;
  demandModel.creator = req.decoded._id;

  demandModel.save(function(err, demand) {

    for (i in req.body.images){
      var ImageModel = new Images();
      ImageModel.image = req.body.images[i].image;
      ImageModel.demandId = demand._id;
      ImageModel.creator = req.decoded._id;
      ImageModel.save(function(err, image){
        demand.images.push(image._id);
      });
    }
    demand.save();

    res.json({ type: true, data: demand });
  });
});

router.get('/:id', function(req, res, next) {
  var queryDemand = Demand.findById(req.params.id);
  queryDemand.populate('comments images');
  queryDemand.exec(function(err, demand){
    if (err) return console.error(err);
    res.json({ type: true, demand: demand });
  });
});

router.post('/:id/comment', function(req, res, next) {

  Demand.findById(req.params.id).exec(function(err, demand) {
    if (err) return console.error(err);
    var commentModel = new Comment();
    commentModel.description = req.body.description;
    commentModel.demandId = demand._id;
    commentModel.creator = req.decoded._id;
    commentModel.save(function(err, comment){
      for (i in req.body.images){
        var ImageModel = new Images();
        ImageModel.image = req.body.images[i];
        ImageModel.commentId = comment._id;
        ImageModel.creator = req.decoded._id;
        ImageModel.save();
      }
      res.json({ type: true, data: comment });
    })
  });
});

router.get('/:id/comment', function(req, res, next) {
  console.log(req.decoded._id);
  var queryComent = Comment.find({demandId: req.params.id});
  queryComent.populate("images");

  queryComent.exec(function(err, comments) {
    if (err) return console.error(err);
    res.json({ type: true, data: comments });
  });
});

module.exports = router;