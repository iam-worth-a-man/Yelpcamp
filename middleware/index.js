var Camps = require("../models/campground");
var Comment    = require("../models/comment")

var middlewareObj = {};

 middlewareObj.checkCampUser =   function (req, res, next){
    if(req.isAuthenticated()){
     Camps.findById(req.params.id, function(err, fcamp){
       if(err){
         req.flash("error","camps not found")
         res.redirect("back")
       } else{
           if(fcamp.author.id.equals(req.user._id)){
             next();
           }
           else {
             req.flash("error","You don't have permission to do that");
             res.redirect("back");
           }
       }
     })
    } else{
      req.flash("error","You need to be logged in")
      res.redirect("back")
    }
  }

  middlewareObj.checkCommentUser=  function (req, res, next){
    if(req.isAuthenticated()){
      Comment.findById(req.params.com_id, function(err, comment){
        if(err){
          req.flash("error","comment not found")
          res.redirect("back");
        } else if(comment.author.id.equals(req.user._id)){
            next();
          } else{
            req.flash("error","You don't have permission to do that");
            res.redirect("back");
          }
        
      });
    } else {
      req.flash("error","You need to be logged in to do that");
      res.redirect("back");
    }
  }

  middlewareObj.isLoggedIn = function (req, res, next){
    if(req.isAuthenticated()){
      return next();
    }
    req.flash("error","You need to be logged in to do that");
    res.redirect("/login");
  }

  module.exports = middlewareObj;