const mongoose = require("mongoose");
const validator = require("validator");

const userSchema =  mongoose.Schema({
   firstName:{
    type:String,
    required:true,
    minLength:2
   },
   lastName:{
    type:String,
    required:true
   },
   emailID:{
    type:String,
    required:true,
    unique:true,
    lowercase:true,
    trim:true,
    validate(value){
      if(!validator.isEmail(value)){
         throw new Error("Invalid Email")
      }
    }
   },
   password:{
    type:String,
    required:true,
    validate(value){
      if(!validator.isStrongPassword(value)){
         throw new Error("Not a strong password")
      }
    }
   },
   gender:{
    type:String,
    validate(value){
      if(!["male","female","others"].includes(value.toLowerCase())){
        throw new Error("Gender is not valid");
      }
    }
   },
   age:{
    type:Number,
    min:18
   },
   photoUrl:{
      type:String,
      default:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwgT2eHovk83Kd0D870HAoiPDi4IQLN9jQjg&s",
      validate(value){
         if(!validator.isURL(value)){
            throw new Error("Not a valid URL")
         }
       }
   },
   about:{
      type:String,
      default:"This is about the user."
   },
   skills:{
      type:[String]
   }
},{timestamps:true})


const User = mongoose.model("User",userSchema);

module.exports=User;