const express= require("express");
const mongoose=require("mongoose");
const cors = require("cors");
const ejs=require("ejs");
const fs = require('fs');
const jimp=require("jimp");
var request = require('request').defaults({ encoding: null });
const axios = require("axios");
const path = require('path');
const imageToBase64 = require('image-to-base64');
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
app.post("/verify",upload.single('image'),async (req, res, next) =>{
const img1=await User.findById("64031e16883108eec9d7e072");
let imagee=req.file.path;
const uploadRes = await cloudinary.uploader.upload(imagee, {
    upload_preset: "onlineShop",
  });
let data1="",data2="";
const image=await imageToBase64(img1.imglink) // Image URL
.then(
    (response) => {
        data1=response;
        console.log("1");
        // console.log(response);
        // encodedParams.append("image1Base64", response);// "iVBORw0KGgoAAAANSwCAIA..."
    }
)
.catch(
    (error) => {
    
        console.log(error); // Logs an error if there was one
    }
)
const image2=await imageToBase64(uploadRes.url) // Image URL
.then(
    (response) => {
        data2=response;
        console.log("2");
        // encodedParams.append("image1Base64", response);// "iVBORw0KGgoAAAANSwCAIA..."
    }
)
.catch(
    (error) => {
        console.log(error); // Logs an error if there was one
    }
)
console.log("helo");
const encodedParams = new URLSearchParams();
 encodedParams.append("image1Base64", "data:image/jpeg;base64,"+data1);
 encodedParams.append("image2Base64", "data:image/jpeg;base64,"+data2);





const options = {
  method: 'POST',
  url: 'https://face-verification2.p.rapidapi.com/faceverification',
  headers: {
    'content-type': 'application/x-www-form-urlencoded',
    'X-RapidAPI-Key': '80d1ea0625msh60a2b6753b661fcp1b2f05jsn48792433dbda',
    'X-RapidAPI-Host': 'face-verification2.p.rapidapi.com'
  },
  data: encodedParams
};

axios.request(options).then(function (response) {
	console.log(response);

}).catch(function (error) {
	console.error(error);
});
// console.log(returnedB64);
// console.log(diff.percent);
// if( diff.percent<0.60){
// // console.log("loggg");
// res.json({
//     success:false,
//     message:"Not Verified",
//     img1:img1.imglink,
//     img2:uploadRes.url
// })
// console.log({
//     success:false,
//     message:"Not Verified",
//     img1:img1.imglink,
//     img2:uploadRes.url
// });
// }else{
//     console.log({
//         success:false,
//         message:" Verified",
//         img1:img1.imglink,
//         img2:uploadRes.url
//     });
//     res.json({
//         success:false,
//         message:"Verified",
//         img1:img1.imglink,
//         img2:uploadRes.url
//     })
// }

// setTimeout(()=>{
//     // console.log("");
//     res.json({message:"mot verified"})
// },80000)




})
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
//     let imagee=req.file.path;
//     const uploadRes = await cloudinary.uploader.upload(imagee, {
//         upload_preset: "onlineShop",
//       });
//       data.imglink=uploadRes.url
// console.log(uploadRes);

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
    port=5000;
}
app.listen(port,()=>{
    console.log("Server started");
});
