var express = require("express");
var router  = express.Router();
var passport   = require("passport");
var LocalStrategy=require("passport-local");
var User = require("../models/user");


router.get('/', function(req, res) {
    res.render("home")
  });
  
  
  router.get("/register", function(req, res){
      res.render("register");
  });
  
  router.post("/register", function(req, res){
    User.register(new User({username: req.body.username}), req.body.password, function(err, user){
      if(err){
        req.flash("error",err.message)
        return res.render("register");
      }
 
      passport.authenticate("local")(req, res, function(){
        req.flash("success","Welcome to Yelpcamp" + user.username)
        res.redirect("/camp");
      });
    });
  });
  
  router.get("/login", function(req, res){
    res.render("login");
  });
  
  router.post("/login", passport.authenticate("local", {
    successRedirect: "/camp",
    failureRedirect: "/login"
  }), function(req, res){
  
  });
  
  router.get("/logout", function(req, res){
    req.logout();
    req.flash("success","Logged you out!");
    res.redirect("/camp");
  });
  
  function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
      return next();
    }
    res.redirect("/login");
  }
  
  

  module.exports = router;