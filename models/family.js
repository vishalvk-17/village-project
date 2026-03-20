const mongoose = require('mongoose');

const familySchema = new mongoose.Schema({
    headName: { 
        type:String, 
        required:true, 
        trim:true 
    },
    address: {
        line1: String, 
        village: String, 
        district: String, 
        state: String, 
        pincode: String
    },
    members: [{ // Villagers array
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    familyNote: {
        type: String,
        trim: true
    }
},{ timestamps:true });

familySchema.index({ headName: 1 });
familySchema.index({ 'address.village': 1 });


module.exports = mongoose.model('Family', familySchema);
