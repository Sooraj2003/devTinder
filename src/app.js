const express = require("express")
require('dotenv').config()
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");




const app = express();

app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}));
app.use(express.json());
app.use(cookieParser());


const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");

app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requestRouter);
app.use("/",userRouter);

connectDB()
.then(()=>{
    console.log("Connection established successfully");
    app.listen(process.env.PORT,()=>{
        console.log("Server is listening on the port "+process.env.PORT);
    })
}).catch((err)=>{
    console.log("Connection failed!");   
})
