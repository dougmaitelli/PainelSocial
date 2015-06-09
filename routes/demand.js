var express = require('express');
var config = require('../config');
var jwt = require("jsonwebtoken");
var router = express.Router();

var app = express();

app.set('SECRET', (process.env.SECRETS || config.secret));

var Demand = require('../models/Demand.js');
var Comment = require('../models/Comment.js');
var Images = require('../models/Image.js');
var Rate = require('../models/Rate.js');

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
  Demand.find({}, 'description longitude latitude created_at', function(err, demands){
    if (err) return console.error(err);
    res.json({type: true, data: demands});
  });
});

router.post('/', function(req, res, next){
  var demandModel = new Demand();
  demandModel.images = [];
  demandModel.description = req.body.description;
  demandModel.longitude = req.body.longitude;
  demandModel.latitude = req.body.latitude;
  demandModel.creator = req.decoded._id;
  for (i in req.body.images){
    demandModel.images.push(req.body.images[i]);
  }
  demandModel.save(function(err, demand) {
    res.json({ type: true, data: demand });
  });
});

router.post('/:id', function(req, res, next){
  var queryDemand = Demand.findById(req.params.id);
  queryDemand.exec(function(err, demand){
    if (err) return console.error(err);
    demand.images = [];
    demand.description = req.body.description;
    for (i in req.body.images){
      demand.images.push(req.body.images[i]);
    }
    demand.save(function(err, demand1) {
      res.json({ type: true, data: demand1 });
    });
  });
});

router.post('/:id/plus', function(req, res, next){
  var queryDemand = Demand.findById(req.params.id);
  queryDemand.exec(function(err, demand){
    if (err) return console.error(err);
    var queryRate = Rate.find({creator: req.decoded._id, demandId: demand._id});
    queryRate.exec(function(err, rate){
      var rateModel = new Rate();
      if(rate == []){
        rateModel.status = 1;
        rateModel.demandId = demand._id;
        rateModel.creator = req.decoded._id;
      }else{
        rateModel.status = 1
        rateModel.demandId = rate.demandId;
        rateModel.creator = rate.demandId;
      }
      console.log(rate);
      rateModel.save(function(err, rate1){
        demand.rate.push(rate1._id);
        demand.save(function(err, demand1) {
          res.json({ type: true, data: demand1 });
        });
      });
    });

  });
});

router.post('/:id/minus', function(req, res, next){
  var queryDemand = Demand.findById(req.params.id);
  queryDemand.exec(function(err, demand){
    if (err) return console.error(err);
    var RateModel = new Rate();
    RateModel.status = 0;
    RateModel.demandId = demand._id;
    RateModel.creator = req.decoded._id;
    RateModel.save(function(err, rate){
      demand.rate.push(rate._id);
      demand.save(function(err, demand1) {
        res.json({ type: true, data: demand1 });
      });
    });
  });
});

router.get('/:id', function(req, res, next) {
  var queryDemand = Demand.findById(req.params.id);
  queryDemand.populate('comments');
  queryDemand.exec(function(err, demand){
    if (err) return console.error(err);
    res.json({ type: true, data: demand });
  });
});

router.post('/:id/comment', function(req, res, next) {
  
  var queryDemand = Demand.findById(req.params.id);
  queryDemand.exec(function(err, demand){
    if (err) return console.error(err);

    var commentModel = new Comment();
    commentModel.description = req.body.description;
    commentModel.demandId = req.params.id;
    commentModel.creator = req.decoded._id;
    for (i in req.body.images){
      commentModel.images.push(req.body.images[i]);
    }
    commentModel.save(function(err, comment){
      demand.comments.push(comment._id);
      demand.save();
      res.json({ type: true, data: comment });
    });
  });

});

router.get('/:id/comment', function(req, res, next) {
  var queryComent = Comment.find({demandId: req.params.id});
  queryComent.exec(function(err, comments) {
    if (err) return console.error(err);
    res.json({ type: true, data: comments });
  });
});

module.exports = router;