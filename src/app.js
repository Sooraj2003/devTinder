const express = require("express")
const connectDB = require("./config/database");
const User = require("./models/user")

const app = express();

app.use(express.json())

app.post("/signup",async (req,res)=>{
    try{
    const user = new User(req.body);
    await user.save();
    res.send("User added successfully")
  }catch(err){
    res.status(400).send("User not added")
    console.log("User not saved"+err.message);
    
  }
    
})

app.get("/user",async (req,res)=>{
try{
  const userId = req.body._id;
  const user =  await User.findById({_id:userId});
  if(user.length===0){
    res.status(404).send("User not found")
  }else{
    res.send(user);
  }
}
catch(err){
  res.send("Something went wrong")
}
  
})

app.get("/feed",async (req,res)=>{
try{
  const users = await User.find({});
  res.send(users);
}
catch(err){
  res.status(400).send("Something went wrong")
}
  
})

app.delete("/user",async (req,res)=>{
  try{
  const userId = req.body.userId;
  const userDeleted = await User.findByIdAndDelete(userId);
  // const userDeleted = await User.findByIdAndDelete({_id:userId});
  console.log(userDeleted);
  
  res.send("User deleted successfully");
  }
  catch(err){
    res.status(400).send("Something went wrong");
  }
  
})

app.patch("/user",async (req,res)=>{
  const ALLOWED_UPDATES = ["age","gender","photoUrl","about","skills"];
  const userId = req.body.userId;
  const data = req.body;
  try{
    const isAllowed = Object.keys(data).every((k)=>ALLOWED_UPDATES.includes(k));

    if(data.Skills?.length>10){
      throw new Error("Skills length should not be greater tham 10")
    }

    if(!isAllowed){
      throw new Error("Update not allowed");
    }
    const updatedUser = await User.findByIdAndUpdate(userId,data,{returnDocument:"after",runValidators:"true"});
    console.log(updatedUser);
    
    res.send("User updated successfully");
  }
  catch(err){
    res.send("Something went wrong "+err.message);
  }
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
