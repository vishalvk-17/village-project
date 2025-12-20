const mongoose = require('mongoose');

const villagerSchema = new mongoose.Schema({
  name: { 
      type:String, 
      required:true, 
      trim:true 
    },
    gender: { 
        type:String, 
        enum:['male','female','other'], 
        required:true 
    },
    yearOfBirth: { 
        type:Number, 
        min:1900, 
        max: new Date().getFullYear() 
    },
    education: { 
        type:String, 
        enum:['none','primary','secondary','higher','graduate','postgraduate','other'], 
        default:'other' 
    },
    occupation: { 
        type:String, 
        trim:true },
    phone: { 
        type:String, 
        match:/^[0-9]{10}$/ , 
        select:false 
    }, // admin-only if needed
    family: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Family' },
    photoURL: String
},{ timestamps:true });


villagerSchema.index({ name:'text', occupation:'text' });
villagerSchema.index({ education:1, occupation:1 });

module.exports = mongoose.model('Villager', villagerSchema);
