var express = require("express");
var router  = express.Router();
var Camps   = require("../models/campground");
var Comment = require("../models/comment");
var middlewareObj=require("../middleware");//or/index can also be used BUT AS A DEFAULT INDEX file is searched in any directory

router.get("/camp/:id/comments/new",middlewareObj.isLoggedIn, function( req, res){
    Camps.findById(req.params.id , function(err, camp){
      if(err){
        console.log(err)
      }
      else {
        res.render("comments/form" , {camp : camp})
      }
    })
  });

  router.post("/camp/:id/comments" ,middlewareObj.isLoggedIn, function( req, res){
    Camps.findById(req.params.id , function( err ,camp){
      if(err){
        console.log(err)
        res.redirect("/camp")
      }
      else {
        Comment.create(req.body.comment, function( err, comment){
          if(err){
            console.log(err)
          }
          else {
            comment.author.id = req.user._id;
            comment.author.username = req.user.username;
            comment.save();
            camp.comments.push(comment)
            camp.save()
            req.flash("success","successfully added comment")
            res.redirect("/camp/" + camp._id)
          }
        })
        
      }
    })
  });

  //====================
  // EDIT COMMENT ROUTES
  //====================

  router.get("/camp/:id/comments/:com_id/edit",middlewareObj.checkCommentUser, function(req, res){
    Comment.findById(req.params.com_id, function(err, fcomment){
      if(err){
        res.redirect("back")
      } else {
          res.render("comments/edit", { camp_ki_id : req.params.id , comment : fcomment });  
      }
    })
  })

  // COMMENT UPDATE
  router.put("/camp/:id/comments/:com_id",middlewareObj.checkCommentUser, function(req, res){
    Comment.findByIdAndUpdate(req.params.com_id, req.body.comment /*or req.body.comment.text  (as in our edit form we have only one comment object ,comment[TEXT]*/,function(err, updcomment){
      if(err){
        res.redirect("back");
      } else{
        res.redirect("/camp/" + req.params.id);
      }
    })
  })

  //DELETE COMMENT

  router.delete("/camp/:id/comments/:com_id",middlewareObj.checkCommentUser, function(req, res){
    Comment.findByIdAndRemove(req.params.com_id, function(err){
      if(err){
        res.redirect("back")
      } else {
        req.flash("success","successfully deleted comment")
        res.redirect("/camp/" + req.params.id)
      }
    })
  })

 
  module.exports = router;