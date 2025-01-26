const express = require("express")
const connectDB = require("./config/database");
const User = require("./models/user")
const {validateSignUp} = require("../utils/validation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt  = require("jsonwebtoken");
const {userAuth} = require("./middlewares/auth")


const app = express();

app.use(express.json())
app.use(cookieParser())


app.post("/signup",async (req,res)=>{
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
    res.send("User added successfully")
  }catch(err){
    res.status(400).send("User not added")
    console.log("User not saved "+err.message);
    
  }
    
})


app.post("/login",async (req,res)=>{
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
    res.send("Login successfull")
  }else{
    throw new Error("Invalid credentials");
  }

}catch(err){
  res.status(400).send("Error : "+err.message)
}
})

app.get("/profile",userAuth,async (req,res)=>{
  try{
    const user = req.user;
       res.send(user);
  }
  catch(err){
    res.status(400).send("Error : "+err.message)
  }
  
  
})

app.post("/connectionRequest",userAuth,async(req,res)=>{
  const user = req.user;
  res.send("Connection request sent by : "+user.firstName)
})

connectDB()
.then(()=>{
    console.log("Connection established successfully");
    app.listen(3000,()=>{
        console.log("Server is listening on the port 3000");
    })
}).catch((err)=>{
    console.log("Connection failed!");   
})
