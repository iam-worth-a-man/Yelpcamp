var express = require("express");
var router  = express.Router();
var Camps   = require("../models/campground");
var middlewareObj=require("../middleware");//or/index can also be used BUT AS A DEFAULT INDEX file is searched in any directory

router.get('/camp', function(req, res) {

    Camps.find({} , function(err, allcamps){
     if(err){
       console.log("error");
     }
     else {
       res.render("camps/camp" , { campdata : allcamps} )
     }
   } 
   );
    
 
   });
 
 
   router.get("/camp/new" ,middlewareObj.isLoggedIn, function( req, res){
     res.render("camps/form")
     
   });
 
   router.get("/camp/:id" , function( req, res){
     Camps.findById(req.params.id).populate("comments").exec(function(err, foundCamp){
       if(err){
         console.log("err in id")
         console.log(err)
       }
       else {
        // console.log(foundCamp)
         res.render("camps/descr" , { foundCamp: foundCamp});
       }
     });
    
   });
 
   router.post("/camp",middlewareObj.isLoggedIn,  function( req, res){
     
     var name = req.body.name;
     var price= req.body.price;
     var image = req.body.image;
     var description  = req.body.description;
     var author = {
       id : req.user._id,
       username : req.user.username
     };
     //use comment form like method for this
     Camps.create({ name : name , price : price , image : image , description : description , author : author} , function(err,newcamp){
       if(err){
         console.log("err here")
       }
       else {
         req.flash("success","successfully added camp")
         res.redirect("/camp")
       }
     })
   });
   //======================
   //EDIT   ROUTES
   //======================
   router.get("/camp/:id/edit",middlewareObj.checkCampUser, function(req, res){
     Camps.findById(req.params.id, function(err, fcamp){
        res.render("camps/edit", { campgrd : fcamp});
       })
     })

   router.put("/camp/:id",middlewareObj.checkCampUser, function(req, res){
     Camps.findByIdAndUpdate(req.params.id, req.body.camp, function(err, updatedcamp){
       if(err){
         res.redirect("/camp")
       } else {
        req.flash("success","Camp edited")
         res.redirect("/camp/" +  req.params.id )
       }
     })
   })
   //================
   // DESTROY ROUTE
   //================

   router.delete("/camp/:id",middlewareObj.checkCampUser, function(req, res){
     Camps.findByIdAndRemove(req.params.id, function(err){
       if(err){
         res.redirect("/camp")
       } else {
         req.flash("success","successfully deleted camp")
         res.redirect("/camp")
       }
     })
   })

 

   module.exports = router;