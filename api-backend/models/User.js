const mongoose=require("mongoose");

const userSchema=new mongoose.Schema({
    password:{
        type:String,
        required:true,
    },
    firstname:{
        type:String,
        required:true,
    },
    lastname:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    mobilenum:{
        type:String,
        required:true,
    },
    hobbies:{
        type:Array,
        required:true,
    },
    location:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    gender:{
        type:String,
        required:true,
    },
    qualitfication:{
        type:String,
        required:true,
    },
    height:{
        type:Number,
        required:true,
    },
    starsign:{
        type:String,
        required:true,
    },
    Drinking:{
        type:Boolean,
        required:true,    
    },
    Smoking:{
        type:Boolean,
        required:true,
    },

});


module.exports=mongoose.model("User",userSchema);