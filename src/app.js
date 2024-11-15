const express = require("express")

const app = express();



app.use("/test",(req,res)=>{
    res.send("hello from test")
})

app.use("/home",(req,res)=>{
    res.send("hello from home")
})
app.use("/",(req,res)=>{
    res.send("hello from root")
})

app.listen(3000,()=>{
    console.log("Server is listening on the port 3000");
})