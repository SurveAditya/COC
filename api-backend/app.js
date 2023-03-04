const express= require("express");
const mongoose=require("mongoose");
const cors = require("cors");
const ejs=require("ejs");
const fs = require('fs');
const path = require('path');
const multer=require("multer");
const cloudinary = require("./cloudinary");
const User=require("./models/User")
const app=express();
var bodyparser = require('body-parser')

app.use(express.json());
app.use(cors({ exposedHeaders: "token" }));


app.use(require("./middlewares/auth"));
app.set('view engine', 'ejs');


// mongoose.connect("mongodb://localhost:27017/hackathondb",{useNewUrlParser:true},()=>{
//     console.log("Connected to Database");
// });
mongoose.connect("mongodb+srv://admin:admin@cluster0.prosblr.mongodb.net/?retryWrites=true&w=majority",{useNewUrlParser:true},()=>{
    console.log("Connected to Database");
});

app.use(bodyparser.urlencoded({
    extended: true
}));
app.use(bodyparser.json());
app.use("/user", require("./routes/user"));
app.get("/dum",async (req,res)=>{
    res.render("dum");
})
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now())
    }
});
 
var upload = multer({ storage: storage });
app.post("/update",upload.single('image'),async (req, res, next) =>{

    let imagee=req.file.path;
    const uploadRes = await cloudinary.uploader.upload(imagee, {
        upload_preset: "onlineShop",
      });
    const data=await User.findByIdAndUpdate("64031e16883108eec9d7e072",{"imglink":uploadRes.url},{new:true});

    res.json({
        "status":"Success",
        "data":data
    })
})
app.post("/register",upload.single('image'),async (req, res, next) =>{
    let data=req.body;
    let imagee=req.file.path;
    const uploadRes = await cloudinary.uploader.upload(imagee, {
        upload_preset: "onlineShop",
      });
      data.imglink=uploadRes.url
console.log(uploadRes);

    const result=new User({...data});
    const response=await result.save();
    if(response){
        res.json({
            "status":"Success",
            data:response

        })
    }



})

let port=process.env.PORT;

if(port==null || port==""){
    port=80;
}
app.listen(port,()=>{
    console.log("Server started");
});
