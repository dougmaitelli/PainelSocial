var express = require('express');
var jwt = require("jsonwebtoken");
var config = require('../config');
var router = express.Router();

var mongoose = require('mongoose');
var User = require('../models/User.js');

var app = express();

app.set('SECRET', (process.env.SECRETS || config.secret));

/* GET home page. */
router.get('/', function(req, res, next) {
  res.json({
    type: true,
    data: 'Hello Sir!'
  });
});

router.post('/authenticate', function(req, res, next) {
  User.findOne({email: req.body.email, password: req.body.password}, function(err, user) {
    if (err) {
      res.json({
        type: false,
        data: "Error occured: " + err
      });
    } else {
      if (user) {
        user.token = jwt.sign(user, app.get('SECRET'), {expiresInMinutes: 1440});
        user.save(function(err, user1) {
          res.json({ type: true, data: user1, token: user1.token });
        });
      } else {
        res.json({
          type: false,
          data: "Incorrect email/password"
        });
      }
    }
  });
});

router.post('/register', function(req, res, next) {
  if (typeof(req.body.name) == "undefined" || typeof(req.body.email) == "undefined" || typeof(req.body.password) == "undefined"){
    res.json({ type: false, data: "Invalid data." });
  }
  User.findOne({email: req.body.email}, function(err, user) {
    if (err) {
      res.json({ type: false, data: "Error occured: " + err });
      return ;
    }
    if (user) {
      res.json({
        type: false,
        data: "User already exists!",
        user: user
      });
      return ;
    }
    var userModel = new User();
    userModel.email = req.body.email;
    userModel.name = req.body.name;
    userModel.password = req.body.password;
    userModel.save(function(err, user) {
      user.token = jwt.sign(user, app.get('SECRET'), {algorithm: 'none', expiresInMinutes: 1440});
      user.save(function(err, user1) {
        res.json({ type: true, data: user1, token: user1.token });
      });
    });
  });
});

module.exports = router;