const jwt = require("jsonwebtoken");
const router = require("express").Router();
const User = require("../models/User");
const config = require("../config");
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');
const multer=require("multer");
const saltRounds = 10;
const isUser = require("../middlewares/isUser");
const cloudinary = require("../cloudinary");
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'routes/uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now())
    }
});
 
var upload = multer({ storage: storage });

router.post("/userregister", async (req, res) => {
	const password = req.body.password;
	const email=req.body.email;
	const firstname=req.body.firstname;
	const lastname=req.body.lastname;
	const confPassword=req.body.confPassword;
	const mobilenum=req.body.mobilenum;
	const gender = req.body.gender;
	const hobbies = req.body.hobbies;
	const location = req.body.location;
	const description = req.body.description;
	const qualitfication = req.body.qualitfication;
	const height = req.body.height;
	const starsign = req.body.starsign;
	const Drinking = req.body.Drinking;
	const Smoking = req.body.Smoking;


	if (!password || !email || !firstname || !lastname || !confPassword || !mobilenum)
		return res.status(400).send("One or more of the fields are missing.");

	//checking for multiple accounts for a single email
	const emailcheck= await User.find({email:email});
	if(emailcheck.length >0) return res.status(400).send("Only one account per email address is allowed");

	if(password!=confPassword) return res.status(400).send("Password and Confirm Password do not match");

	// add user
	bcrypt.hash(password, saltRounds, async function(err, hash) {
		const newUser = new User({password:hash, firstname,lastname,email,mobilenum,hobbies,location,description,gender,qualitfication,height,starsign,Drinking,Smoking });
		return res.json(await newUser.save());
	});
	
});

router.post("/userlogin", async (req, res) => {
	const { email, password } = req.body;

	if (!email || !password)
		return res.status(400).send("Missing email or password");

	// checking if email exists
	const emails = await User.find({ email: email });
	if (emails.length === 0) return res.status(400).send("Email is incorrect");

	const user = emails[0];

	bcrypt.compare(password, user.password, async function(err, result) {
		if(result==false) return res.status(400).send("Incorrect password");

		// sending token
		const token =jwt.sign(
		{
			id: user._id,
		},
		config.jwtSecret,{expiresIn:"1d"}
		);
		res.setHeader("token", token);
		const name=user.firstname;
		res.json({ token,name });
	});
});


//register events
router.post("/registerEvent", upload.single('image'),async (req, res, next) => {
	try{
	const name = req.body.name;
	const description = req.body.description;
	const location = req.body.location;
	const date = req.body.date;
	const time = req.body.time;
	// const imagesa = req.body.image;
	// console.log(imagesa);
	const creator = req.body.creator;
	console.log("hello");
	console.log(req.file.path);
    let imagee=req.file.path;
	console.log(imagee);
let imag=fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename));

  const uploadRes = await cloudinary.uploader.upload(imagee, {
                  upload_preset: "onlineShop",
                });
	console.log(uploadRes);
	// const uploadedImage = await cloudinary.uploader.upload(imagesa, {
	// 	folder: "ksr",
	// });
	// console.log(uploadedImage)
	// const image = uploadedImage.secure_url
	// // add event
	// const newEvent = new Event({name,description,location,date,time,image,creator });
	// await newEvent.save()
	res.send({
		success: true,
		message: "Event created successfully",
	  });
	}
	catch (error) {
		console.log(error);
		res.send({
		  message: error.message,
		  success: false,
		});
	  }


	
});






  

module.exports = router;
