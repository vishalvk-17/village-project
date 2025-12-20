const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    name: {
        type: String, 
        required: true, 
        trim: true 
    },
    age: Number,
    email: { 
        type:String,
        required:true, 
        unique:true, 
        lowercase:true, 
        trim:true 
    },
    image: String,
    password:{
        type:String, 
        required:true, 
        minlength:6 
        },
    family: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Family",   // Reference to Family model
        // required: true
    },
    villager: { // One-to-One link
        type: mongoose.Schema.Types.ObjectId,
        ref: "Villager"
    },
    role:{ 
        type:String, 
        enum:['admin','viewer'], 
        default:'viewer' 
    }
},{ timestamps:true });

const User = mongoose.model("User", userSchema);
module.exports = User;
