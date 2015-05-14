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
    var images = [];
    Images.find({commentId: comment._id}, function(err, image) {
      images.push(image);
      res.json({ type: true, comment: comment, images: images });
    });
  });
});

router.post('/:id', function(req, res, next) {

  Comment.findById(req.params.id).exec(function(err, comment) {
    if (err) return console.error(err);

    comment.description = req.body.description;
    comment.save(function(err, comment){
      for (i in req.body.images){
        var ImageModel = new Images();
        ImageModel.image = req.body.images[i];
        ImageModel.commentId = comment._id;
        ImageModel.save();
      }
      res.json({ type: true, data: comment });
    })
  });
});

module.exports = router;