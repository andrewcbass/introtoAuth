var express = require('express');
var router = express.Router();
var jwt = require("jwt-simple");

var User = require("../models/user");

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log("req.cookies", req.cookies);
  res.render('index', { title: 'Express' });
});

//GET to /protected

////////////////////////
// PROTECTED ZONE BELOW
// router.use(User.authMiddleware);

router.get("/protected", User.authMiddleware, function(req, res) {
  console.log('REQ.USER', req.user);
  res.send("woot! protected.");
});

module.exports = router;
