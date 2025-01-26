const jwt = require("jsonwebtoken")
const User = require("../models/user")

const userAuth = async (req,res,next)=>{
   try{ 
    //Validate the token
    const {token} = req.cookies;
    if(!token){
        throw new Error("Token not found!!!")
    }
    const decodedObj = await jwt.verify(token,"Dev@Tinder69");
    const {_id } = decodedObj;

    const user = await User.findById(_id);
    if(!user){
        throw new Error("User not found")
    }
    req.user = user;
    next();
}
    catch(err){
        res.status(400).send("Error : "+err.message)
    }
}


module.exports = {
    userAuth
}