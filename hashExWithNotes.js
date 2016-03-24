//this file is for REF!  not used in app
"use strict"

var bcrypt = require("bcryptjs");

var password = "secret";

console.time("hashing");
//REGISTRATION (user creation)
//turning the password int a hash
bcrypt.genSalt(8, function(err, salt) {
  //the first argument, the number, tells the complexity.
  //time ~~ doubles for every integer increase
  //13 or 14 is what Cade uses, we are using a small number to speed testing
  //the increase on launch
  bcrypt.hash(password, salt, function(err, hash) {
    //hash will get stored in the db
    console.timeEnd("hashing");

    console.log('HASH', hash);


    console.time("comparing");
    // AUTHENTICATION (logging in)
    bcrypt.compare("notsecret", hash, function(err, res) {
      console.timeEnd("comparing");

      console.log('RES', res);

    });
  });
});
