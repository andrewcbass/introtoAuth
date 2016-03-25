"use strict";

var mongoose = require("mongoose");
var bcrypt = require("bcryptjs");
var jwt = require("jwt-simple");

const JWT_SECRET = "this is my secret: I don't like the taste of corn!"

var User;

var userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  }
});

userSchema.statics.authMiddleware = function(req, res, next) {
  // check token,
  // if valid, and user exists, call next()
  // else, respond with 401

  var token = req.cookies.cadecookie;
  try {
    var payload = jwt.decode(token, JWT_SECRET);
  } catch(err) {
    return res.clearCookie("cadecookie").status(401).send();
  }

  User.findById(payload.userId, function(err, user) {
    if(err || !user) {
      return res.status(401).send(err);
    }
    // the user does exist
    req.user = user; //allows us to use req.user on other end (the route)
    next(); //everything is good, continue with request.
  });
};

//creating a new method called "register"
userSchema.statics.register = function(userObj, cb) {
  //1.  hash the password
  //2.  create the new user document
  //3. call the callback, with any error

  //we now know username is NOT taken
  //step 1:
  bcrypt.hash(userObj.password, 10, function(err, hash) {
    if (err) {
      return cb(err);
    }
    //step 2:
    User.create({
      username: userObj.username,
      password: hash
    //step 3:
    }, function(err) {
      cb(err);
    });
    //the password is not stored on the server, but the hash is
  });
};

userSchema.statics.authenticate = function(userLogIn, cb) {

  User.findOne({ 'username': userLogIn.username}, function(err, userDB) {
    if(err || !userDB) {
      return cb(err || 'Authentication failed, rookie!');
    }

  bcrypt.compare(userLogIn.password, userDB.password, function(err, res) {
    if(err || !res) {
      return cb(err || "Authentication failed, rookie!");
    }
    if(res) {

      //username and password are valid
      //userDB is the user logging in
      var payload = {
        userId: userDB._id,
        iat: Date.now() //issued at time
      };
      //generate token
      var token = jwt.encode(payload, JWT_SECRET);
      cb(null, token);
    }
  });
});
}

User = mongoose.model("User", userSchema);

module.exports = User;
