const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user")
const userRouter = express.Router();

const USER_SAFE_DATA = "firstName lastName gender age photoUrl skills about"

userRouter.get("/user/requests",userAuth,async (req,res)=>{
    try{
    const loggedInUser = req.user;
      const connectionRequests = await ConnectionRequest.find({
        toUserId:loggedInUser._id,
        status:"interested"
      }).populate("fromUserId",USER_SAFE_DATA);

      const data = connectionRequests.map(req => ({
        connectionRequestId: req._id,  // Attach ConnectionRequest ID
        fromUser: req.fromUserId
    }));

      res.json({message:"Connection requests",data:data})
    }catch(err){
        res.status(400).send("ERROR : "+err.message)
    }
})

userRouter.get("/user/connections",userAuth,async (req,res)=>{
try{
const loggedInUser = req.user;

const connections = await ConnectionRequest.find({
    $or :
    [
        {fromUserId:loggedInUser._id,status:"accepted"},
        {toUserId:loggedInUser._id,status:"accepted"}
    ]
}).populate("fromUserId",USER_SAFE_DATA).populate("toUserId",USER_SAFE_DATA);



const data = connections.map((req)=>{
    if(loggedInUser._id.toString()==req.fromUserId._id.toString()){
      return req.toUserId;
    }else{
        return req.fromUserId;
    }
})

res.json({message:"Connections of "+loggedInUser.firstName,connections:data})
}catch(err){
    res.status(400).send("ERROR : "+err.message);
}
})

userRouter.get("/user/feed",userAuth,async (req,res)=>{
    try{
        const loggedInUser = req.user;
        
        const page = req.query.page || 1;
        let limit = req.query.limit || 10;
        limit = limit > 50 ? 10 : limit;
        const skip = (page-1)*limit;

        const hideFromFeed = await ConnectionRequest.find({
            $or :[
                {toUserId:loggedInUser._id},{fromUserId:loggedInUser._id}
            ]
        })

        const uniqueHideFromFeed = new Set();
        hideFromFeed.map((req)=>{
            uniqueHideFromFeed.add(req.toUserId.toString());
            uniqueHideFromFeed.add(req.fromUserId.toString());
        })
      
        const feed = await User.find({
            $and :[
                { _id: { $nin: Array.from(uniqueHideFromFeed) } },
                {_id : {$ne : loggedInUser._id}}
            ]
        }).select(USER_SAFE_DATA).skip(skip).limit(limit);

        res.json({message:loggedInUser.firstName+" feed",feed:feed})
        
    }catch(err){
        res.status(400).send("ERROR : "+err.message);
    }
})
module.exports = userRouter;