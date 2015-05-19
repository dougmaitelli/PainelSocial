var express = require('express');
var config = require('../config');
var jwt = require("jsonwebtoken");
var router = express.Router();

var app = express();

app.set('SECRET', (process.env.SECRETS || config.secret));

var User = require('../models/User.js');

router.use(function(req, res, next) {
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  if (token) {
    jwt.verify(token, app.get('SECRET'), {algorithm: 'none'}, function(err, decoded) {      
      if (err) { return res.json({ success: false, message: 'Failed to authenticate token.' }); }
      else { req.decoded = decoded; next(); }
    });
  } else {
    return res.status(403).send({ success: false, message: 'No token provided.' });
  }
});

/* GET users listing. */
router.get('/', function(req, res, next) {
  User.find(function(err, users) {
    if (err) return console.error(err);
    res.json({type: true, data: users});
  });
});

router.get('/:id', function(req, res, next) {
  console.log(req.params);
  User.findById(req.params.id, function(err, users) {
    if (err) return console.error(err);
    res.json({type: true, data: users});
  });
});

module.exports = router;
