const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    name: {
        type: String, 
        required: true, 
        trim: true 
    },
    age: Number,
    gender: {
        type: String,
        enum: ["male", "female", "other"],
        default: "other"
    },
    email: { 
        type:String,
        required:true, 
        unique:true, 
        lowercase:true, 
        trim:true 
    },
    phone: {
        type: String,
        trim: true
    },
    village: {
        type: String,
        trim: true,
        default: "Bhilkheda"
    },
    profession: {
        type: String,
        required: true,
        trim: true
    },
    education: {
        type: String,
        trim: true
    },
    about: {
        type: String,
        trim: true
    },
    imageData: String,
    imageType: String,
    password:{
        type:String, 
        required:true, 
        minlength:6 
        },
    role:{ 
        type:String, 
        enum:['admin','viewer'], 
        default:'viewer' 
    },
    isApproved: {
        type: Boolean,
        default: false
    }
},{ timestamps:true });

const User = mongoose.model("User", userSchema);
module.exports = User;
