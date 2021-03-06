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
      if (err) { return res.json({ success: false, message: 'Failed to authenticate token.' }); }
      else { req.decoded = decoded; next(); }
    });
  } else {
    return res.status(403).send({ success: false, message: 'No token provided.' });
  }
});

router.get('/:id', function(req, res, next) {
  Comment.findById(req.params.id).exec(function(err, comment) {
    if (err) return console.error(err);
    res.json({ type: true, data: comment });
  });
});

router.post('/:id', function(req, res, next) {
  Comment.findById(req.params.id).exec(function(err, comment) {
    if (err) return console.error(err);
    comment.description = req.body.description;
    comment.images = [];
    for (i in req.body.images){
      comment.images.push(req.body.images[i]);
    }
    comment.save(function(err, comment){
      res.json({ type: true, data: comment });
    })
  });
});

router.delete('/:id', function(req, res, next) {

  Comment.findByIdAndRemove(req.params.id).exec(function(err, comment) {
    if (err) return console.error(err);
    res.json({ type: true, data: comment });
  });
});

module.exports = router;