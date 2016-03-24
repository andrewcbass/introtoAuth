"use strict";

var mongoose = require("mongoose");
var bcrypt = require("bcryptjs");

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
      cb(null, userDB);
    }
  });
});
}

User = mongoose.model("User", userSchema);

module.exports = User;
