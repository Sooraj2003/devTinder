const validator = require('validator');

const validateSignUp = (req)=>{
    const {firstName,lastName,emailID} = req.body;

    if(!firstName || !lastName){
        throw new Error("Enter full name");
    }else if(firstName>=4 && firstName<=50){
        throw new Error("correct the length of name");
    }else if(!validator.isEmail(emailID.trim())){
        throw new Error("Invalid email")
    }
}

module.exports = {
    validateSignUp
}