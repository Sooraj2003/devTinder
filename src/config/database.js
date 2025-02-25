const mongoose = require("mongoose");



const connectDB = async ()=>{
    await mongoose.connect("mongodb+srv://soorajnp:grg72muT1zVmfGjO@cluster0.qu5h6.mongodb.net/devTinder?retryWrites=true&w=majority&appName=Cluster0")
}


module.exports = connectDB;

