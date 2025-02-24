const express = require("express");
const requestRouter = express.Router();
const {userAuth} = require("../middlewares/auth")
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

requestRouter.post("/request/send/:status/:toUserId",userAuth,async(req,res)=>{
     try{
      const allowedStatus = ["interested","ignored"];

      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      const isStatusValid = allowedStatus.includes(status);

      if(!isStatusValid){
        throw new Error("Invalid type of status");
      }

      const toUser = await User.findById(toUserId);

      if(!toUser){
        throw new Error("Invalid User Id")
      }

      const request = await ConnectionRequest.findOne({
       $or:[
        {
          fromUserId,
          toUserId
        },
        {
          fromUserId:toUserId,
          toUserId:fromUserId
        }
       ]
      })

      if(request){
        throw new Error("Request already present - Invalid request")
      }


        const connectionRequest = new ConnectionRequest({
          fromUserId,
          toUserId,
          status
        })
        const requestData = await connectionRequest.save();
        res.json({
          message:"Connection Request Sent",
          data:requestData
        })
     }catch(err){
      res.status(400).send("ERROR : "+err.message)
     }
  })

requestRouter.post("/request/review/:status/:requestId",userAuth,async(req,res)=>{
try{
const loggedInUser = req.user;
const allowedStatus = ["accepted","rejected"];
const {status,requestId} = req.params;
if(!allowedStatus.includes(status)){
  throw new Error("Invalid status type "+status)
}
const connectionRequest = await ConnectionRequest.findOne({
  _id:requestId,
  toUserId:loggedInUser._id,
  status:"interested"
})
if(!connectionRequest){
  throw new Error("Request not found")
}
connectionRequest.status = status;
const data = await connectionRequest.save();
res.json({message:status,data:data})

}
catch(err){
  res.status(400).send("ERROR : "+err.message);
}
})

  module.exports = requestRouter;