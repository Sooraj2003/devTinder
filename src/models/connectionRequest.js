
const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema({
    fromUserId:{
        type:mongoose.SchemaTypes.ObjectId,
        ref:"User"
    },
    toUserId:{
        type:mongoose.SchemaTypes.ObjectId,
        ref:"User"
    },
    status:{
        type:String,
        enum : [
            {
                values : ["interested","ignored","accepted","rejected"],
                message :'{VALUE} is invalid type of status'
            }
        ]
    }

    
},{
    timestamps:true
})

connectionRequestSchema.pre("save",function(next){
    const request = this;
    if(request.fromUserId.equals(request.toUserId)){
         throw new Error("Invalid request - fromUserId is same as toUserId");
    }

    next();
})

connectionRequestSchema.index({fromUserId:1,toUserId:1});

const ConnectionRequest = new mongoose.model("ConnectionRequest",connectionRequestSchema);

module.exports = ConnectionRequest;