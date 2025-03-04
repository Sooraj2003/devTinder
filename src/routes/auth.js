 const express = require("express");
 const authRouter = express.Router();
 const User = require("../models/user");
 const bcrypt = require("bcrypt");
 const {validateSignUp} = require("../../utils/validation");

 
 
 authRouter.post("/signup",async (req,res)=>{
    try{
    validateSignUp(req);
    const {firstName,lastName,emailID,password} = req.body;
    const passwordHash = await bcrypt.hash(password,10);
    const user = new User({
      firstName,
      lastName,
      emailID,
      password:passwordHash
    });
    await user.save();
    const token = await user.getJwt();
    res.cookie("token",token,{ 
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days in milliseconds
    });

    res.send(user);
  }catch(err){
    res.status(400).send("User not added")
    console.log("User not saved "+err.message);
    
  }
    
})

authRouter.post("/login",async (req,res)=>{
    try{
      const {emailID,password} = req.body;
    
      const user = await User.findOne({emailID:emailID});
     
      
    
      if(!user){
        throw new Error("Invalid credentials");
      }
    
      const isPasswordValid = await user.comparePassword(password);
      if(isPasswordValid){
        // Create a jwt token
        const token = await user.getJwt();
        // Wrap token into the cookie send it to the user
        res.cookie("token",token,{ 
          expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days in milliseconds
        });
        res.send(user);
      }else{
        throw new Error("Invalid credentials");
      }
    
    }catch(err){
      res.status(400).send("Error : "+err.message)
    }
 })

 authRouter.post("/logout", (req,res)=>{
    res.cookie("token",null,{
        expires : new Date(Date.now())
    })

    res.send("Logout successfull")
 })

 module.exports = authRouter;