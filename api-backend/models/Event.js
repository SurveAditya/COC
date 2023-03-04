const mongoose=require('mongoose');

const eventSchema=new mongoose.Schema({
    participants:{
        type:Array,
    },
    name:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    location:{
        type:String,
        required:true,
    },
    date:{
        type:String,
        required:true,
    },
    time:{
        type:String,
        required:true,
    },
    image:{
        type:String,
        required:true,
    },
    creator:{
        type:String,
        required:true,
    }
});