const express = require("express");
const profileRouter = express.Router();
const {userAuth} = require("../middlewares/auth");


profileRouter.get("/profile",userAuth,async (req,res)=>{
    try{
      const user = req.user;
         res.send(user);
    }
    catch(err){
      res.status(400).send("Error : "+err.message)
    }
    
    
  })

profileRouter.patch("/profile/edit",userAuth,async (req,res)=>{
    
    try{
        // Update validation
    const allowedUpdates = ["firstName","lastName","age","gender","skills","about","photoUrl"];
    const isUpdateAllowed = Object.keys(req.body).every((key)=>allowedUpdates.includes(key));

    if(!isUpdateAllowed){
        throw new Error("Invalid update")
    }
    const loggedInUser = req.user;
    
    Object.keys(req.body).forEach((key)=>loggedInUser[key] = req.body[key]);
    loggedInUser.save();

    res.json({message:`${loggedInUser.firstName} , profile updated successfully`,
        data : loggedInUser
     
    },
    )

    }
    catch(err){
        res.status(400).send("ERR : "+err.message);
    }
})

  module.exports = profileRouter;