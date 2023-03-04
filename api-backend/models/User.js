const mongoose=require("mongoose");

const userSchema=new mongoose.Schema({
    password:{
        type:String,
        
    },
    imglink:{
type:String
    },
    verify:{
        type:String,
        default:false
    },

    email:{
        type:String,
        // required:true,
    },
    mobilenum:{
        type:String,
        // required:true,
    },
    interests:{
        type:Array,
        required:true,
    },
    location:{
        type:String,
        // required:true,
    },
    tagline:{
        type:String,
        required:true,
    },
    gender:{
        type:String,
        required:true,
    },
    age:{
        type:String,
        required:true
    },
    profession:{
        type:String,
        required:true,
    },
    height:{
        type:Number,
        // required:true,
    },
    starsign:{
        type:String,
        // required:true,
    },
    Drinking:{
        type:Boolean,
        // required:true,    
    },
    Smoking:{
        type:Boolean,
        // required:true,
    },
    genderPreferences:{
        type:String,
        required:true
    }

});


module.exports=mongoose.model("User",userSchema);