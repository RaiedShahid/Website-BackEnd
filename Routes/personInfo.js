const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const express = require("express");
const _ = require("lodash");
const router = express.Router();
const Joi = require("joi");
const mongoose = require("mongoose");
var fs = require("fs");
const aws = require("aws-sdk");
const multerS3 = require("multer-s3");
const path = require("path");
const url = require("url");
const multer = require("multer");
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "./uploads/");
	},
	filename: function (req, file, cb) {
		cb(null, Date.now() + file.originalname);
	},
});

const fileFilter = (req, file, cb) => {
	if (
		file.mimetype === "image/jpeg" ||
		file.mimetype === "image/jpg" ||
		file.mimetype === "image/png"
	) {
		cb(null, true);
	} else {
		cb(new Error("Image type not supported"), false);
	}
};

// const s3 = new aws.S3({
// 	accessKeyId: "AKIAXHPKZDOCQXRBH3HL",
// 	secretAccessKey: "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",
// 	Bucket: "fyppictures",
// });

// const profileImgUpload = multer({
// 	storage: multerS3({
// 		s3: s3,
// 		bucket: "fyppictures",
// 		acl: "public-read",
// 		key: function (req, file, cb) {
// 			cb(
// 				null,
// 				path.basename(file.originalname, path.extname(file.originalname)) +
// 					"-" +
// 					Date.now() +
// 					path.extname(file.originalname)
// 			);
// 		},
// 	}),
// 	limits: { fileSize: 2000000 }, // In bytes: 2000000 bytes = 2 MB
// 	fileFilter: function (req, file, cb) {
// 		checkFileType(file, cb);
// 	},
// }).single("profileImage");

// function checkFileType(file, cb) {
// 	// Allowed ext
// 	const filetypes = /jpeg|jpg|png|gif/;
// 	// Check ext
// 	const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
// 	// Check mime
// 	const mimetype = filetypes.test(file.mimetype);
// 	if (mimetype && extname) {
// 		return cb(null, true);
// 	} else {
// 		cb("Error: Images Only!");
// 	}
// }

// const upload = multer({
// 	storage: storage,
// 	limits: {
// 		fileSize: 1024 * 1024 * 5
// 	},
// 	fileFilter: fileFilter
// });

const upload = multer({ storage: storage }).single("file");
const upload2 = multer({ storage: storage }).single("personImage");

const personSchema = new mongoose.Schema({
	personImage: { type: String, required: true },
	personImage2: { type: String },
	personImage3: { type: String },
	postingUser: { type: String },
	category: { type: String },
	name: { type: String, required: true, minlength: 3 },
	age: { type: Number, required: true },
	day: { type: String },
	month: { type: String },
	date: { type: String },
	year: { type: String },
	cDate: { type: Date },
	city: { type: String, required: true, minlength: 3 },
	province: { type: String, required: true, minlength: 3 },
	area: { type: String },
	details: { type: String },
	contactName: { type: String, required: true, minlength: 3 },
	contactNumber: { type: String, required: true, minlength: 11 },
	contactAddress: { type: String },
});

const userSchema = new mongoose.Schema({
	firstname: { type: String, required: true },
	lastname: { type: String, required: true },
	email: { type: String, unique: true, required: true },
	password: { type: String, required: true },
	cpassword: { type: String, required: true },
});

const mobileSchema = new mongoose.Schema({
	personImage: { type: String, required: true },
	personImage2: { type: String },
	personImage3: { type: String },
	postingUser: { type: String },
	category: { type: String },
	mobilename: { type: String, required: true, minlength: 5 },
	company: { type: String, required: true },
	ime: { type: String, required: true },
	color: { type: String, required: true, minlength: 3 },
	type: { type: String, required: true },
	day: { type: String },
	month: { type: String },
	date: { type: String },
	year: { type: String },
	cDate: { type: Date },
	city: { type: String, required: true, minlength: 3 },
	province: { type: String, required: true, minlength: 3 },
	area: { type: String },
	details: { type: String },
	contactName: { type: String, required: true, minlength: 3 },
	contactNumber: { type: String, required: true, minlength: 11 },
	contactAddress: { type: String },
});

const vehicleSchema = new mongoose.Schema({
	personImage: { type: String, required: true },
	personImage2: { type: String },
	personImage3: { type: String },
	postingUser: { type: String },
	category: { type: String },
	carname: { type: String, required: true, minlength: 5 },
	company: { type: String, required: true },
	platenumber: { type: String, required: true },
	color: { type: String, required: true, minlength: 3 },
	type: { type: String, required: true },
	day: { type: String },
	month: { type: String },
	date: { type: String },
	year: { type: String },
	cDate: { type: Date },
	city: { type: String, required: true, minlength: 3 },
	province: { type: String, required: true, minlength: 3 },
	area: { type: String },
	details: { type: String },
	contactName: { type: String, required: true, minlength: 3 },
	contactNumber: { type: String, required: true, minlength: 11 },
	contactAddress: { type: String },
});
const Person = mongoose.model("Person", personSchema);
const Mobile = mongoose.model("Mobile", mobileSchema, "people");
const Vehicle = mongoose.model("Vehicle", vehicleSchema, "people");
const User = mongoose.model("User", userSchema, "RegisteredUsers");

router.get("/user", async (req, res) => {
	const user = await User.find();
	res.send(user);
});

router.get("/", async (req, res) => {
	const person = await Person.find().sort({ cDate: -1 });

	res.send(person);
});

router.get("/profile/:id", async (req, res) => {
	const person = await Person.find({ postingUser: req.params.id });

	if (!person) {
		res.status(400).send("No user with this id");
		return;
	}
	res.send(person);
});
router.post("/signup", async (req, res) => {
	let user = await User.findOne({ email: req.body.email });
	if (user) return res.status(400).send("User Already Exists");
	console.log(req.body);

	user = new User({
		firstname: req.body.firstname,
		lastname: req.body.lastname,
		email: req.body.email,
		password: req.body.password,
		cpassword: req.body.cpassword,
	});
	const salt = await bcrypt.genSalt(10);
	user.password = await bcrypt.hash(user.password, salt);
	user = await user.save();

	const token = jwt.sign(
		{ _id: user._id, name: user.firstname + " " + user.lastname },
		"PrivateKey"
	);
	res
		.header("x-auth-token", token)
		.header("access-control-expose-headers", "x-auth-token")
		.send(_.pick(user, ["firstname", "lastname", "email"]));
});

router.put("/forget", async (req, res) => {
	let user = await User.findOne({ email: req.body.email });
	if (!user) {
		return res.status(400).send("Invalid Email or Password.");
	} else {
		user.password = req.body.password;
		user.cpassword = req.body.password;
		const salt = await bcrypt.genSalt(10);
		user.password = await bcrypt.hash(user.password, salt);
		const result = await user.save();
		res.send(result);
		console.log(result);
	}
});

router.post("/auth", async (req, res) => {
	const result = validateLogin(req.body);

	if (result.error) {
		res.status(400).send(result.error.details[0].message);
		console.log("validate issue", result.error.details[0].message);
		return;
	}
	console.log(req.body);
	let user = await User.findOne({ email: req.body.email });
	if (!user) return res.status(400).send("Invalid Email or Password.");

	const validPassword = await bcrypt.compare(req.body.password, user.password);
	if (!validPassword) return res.status(400).send("Invalid Email or Password");
	const token = jwt.sign(
		{ _id: user._id, name: user.firstname + " " + user.lastname },
		"PrivateKey"
	);
	res.send(token);
});

router.post("/form", function (req, res) {
	// const result = validateUser(req.body);
	const imageValidation = validateImage(req.file);

	if (imageValidation.error) {
		res.status(400).send(imageValidation.error.details[0].message);
		console.log("validate issue", imageValidation.error.details[0].message);
		return;
	}
	// if (result.error) {
	// 	res.status(400).send(result.error.details[0].message);
	// 	console.log("validate issue", result.error.details[0].message);
	// 	return;
	// }
	// var binarydata = fs.readFileSync(req.file);
	// var base64 = new Buffer(binarydata).toString("base64");
	// console.log("Base64", base64);

	upload(req, res, async function (err) {
		if (err instanceof multer.MulterError) {
			return res.status(500).json(err);
		} else if (err) {
			return res.status(500).json(err);
		}

		console.log("File ", req.file);
		let person = new Person({
			// personImage: "uploads/" + req.file.filename,
			personImage: req.body.personImage,
			personImage2: req.body.personImage2,
			personImage3: req.body.personImage3,
			postingUser: req.body.postingUser,
			category: req.body.category,
			name: req.body.name,
			day: req.body.day,
			month: req.body.month,
			date: req.body.date,
			year: req.body.year,
			cDate: req.body.cDate,
			city: req.body.city,
			age: req.body.age,
			province: req.body.province,
			area: req.body.area,
			details: req.body.details,
			contactName: req.body.contactName,
			contactNumber: req.body.contactNumber,
			contactAddress: req.body.contactAddress,
		});
		person = await person.save();
		res.send(person);
		return res.status(200).send(req.file);
	});
});

router.post("/mobileform", function (req, res) {
	// const result = validateUser(req.body);
	const imageValidation = validateImage(req.body.personImage);

	if (imageValidation.error) {
		res.status(400).send(imageValidation.error.details[0].message);
		console.log("validate issue", imageValidation.error.details[0].message);
		return;
	}
	// if (result.error) {
	// 	res.status(400).send(result.error.details[0].message);
	// 	console.log("validate issue", result.error.details[0].message);
	// 	return;
	// }
	// var binarydata = fs.readFileSync(req.file);
	// var base64 = new Buffer(binarydata).toString("base64");
	// console.log("Base64", base64);

	upload(req, res, async function (err) {
		if (err instanceof multer.MulterError) {
			return res.status(500).json(err);
		} else if (err) {
			return res.status(500).json(err);
		}

		console.log("File ", req.file);
		let mobile = new Mobile({
			// personImage: "uploads/" + req.file.filename,
			personImage: req.body.personImage,
			personImage2: req.body.personImage2,
			personImage3: req.body.personImage3,
			postingUser: req.body.postingUser,
			category: req.body.category,
			mobilename: req.body.mobilename,
			company: req.body.company,
			ime: req.body.ime,
			color: req.body.color,
			type: req.body.type,
			day: req.body.day,
			month: req.body.month,
			date: req.body.date,
			year: req.body.year,
			cDate: req.body.cDate,
			city: req.body.city,
			age: req.body.age,
			province: req.body.province,
			area: req.body.area,
			details: req.body.details,
			contactName: req.body.contactName,
			contactNumber: req.body.contactNumber,
			contactAddress: req.body.contactAddress,
		});
		mobile = await mobile.save();
		res.send(mobile);
		return res.status(200).send(req.file);
	});
});

router.post("/Vehicleform", function (req, res) {
	// const result = validateUser(req.body);
	const imageValidation = validateImage(req.body.personImage);

	if (imageValidation.error) {
		res.status(400).send(imageValidation.error.details[0].message);
		console.log("validate issue", imageValidation.error.details[0].message);
		return;
	}
	// if (result.error) {
	// 	res.status(400).send(result.error.details[0].message);
	// 	console.log("validate issue", result.error.details[0].message);
	// 	return;
	// }
	// var binarydata = fs.readFileSync(req.file);
	// var base64 = new Buffer(binarydata).toString("base64");
	// console.log("Base64", base64);

	upload(req, res, async function (err) {
		if (err instanceof multer.MulterError) {
			return res.status(500).json(err);
		} else if (err) {
			return res.status(500).json(err);
		}

		console.log("File ", req.file);
		let vehicle = new Vehicle({
			// personImage: "uploads/" + req.file.filename,
			personImage: req.body.personImage,
			personImage2: req.body.personImage2,
			personImage3: req.body.personImage3,
			postingUser: req.body.postingUser,
			category: req.body.category,
			carname: req.body.carname,
			company: req.body.company,
			platenumber: req.body.platenumber,
			color: req.body.color,
			type: req.body.type,
			day: req.body.day,
			month: req.body.month,
			date: req.body.date,
			year: req.body.year,
			cDate: req.body.cDate,
			city: req.body.city,
			age: req.body.age,
			province: req.body.province,
			area: req.body.area,
			details: req.body.details,
			contactName: req.body.contactName,
			contactNumber: req.body.contactNumber,
			contactAddress: req.body.contactAddress,
		});
		vehicle = await vehicle.save();
		res.send(vehicle);
		return res.status(200).send(req.file);
	});
});

router.get("/:id", async (req, res) => {
	const person = await Person.findById(req.params.id);

	if (!person) {
		res.status(400).send("No user with this id");
		return;
	}
	res.send(person);
});

router.get("/user/:id", async (req, res) => {
	const user = await User.findById(req.params.id);

	if (!user) {
		res.status(400).send("No user with this id");
		return;
	}
	res.send(user);
});

router.put("/:id", function (req, res) {
	// const result = validateUser(req.body, req.file);
	// if (result.error) {
	// 	res.status(400).send(result.error.details[0].message);
	// 	return;
	// }

	upload2(req, res, async function (err) {
		if (err instanceof multer.MulterError) {
			return res.status(500).json(err);
		} else if (err) {
			return res.status(500).json(err);
		}
		console.log("File ", req.file);

		const person = await Person.findByIdAndUpdate(
			req.params.id,
			{
				personImage: req.body.personImage,
				personImage2: req.body.personImage2,
				personImage3: req.body.personImage3,
				postingUser: req.body.postingUser,
				category: req.body.category,
				name: req.body.name,
				//date: req.body.date,
				age: req.body.age,
				city: req.body.city,
				province: req.body.province,
				area: req.body.area,
				details: req.body.details,
				contactName: req.body.contactName,
				contactNumber: req.body.contactNumber,
				contactAddress: req.body.contactAddress,
			},
			{ new: true }
		);
		if (!person) {
			res.status(404).send("No user with this id");
			return;
		}

		res.send(person);
	});
});

router.put("/mobile/:id", function (req, res) {
	// const result = validateUser(req.body, req.file);
	// if (result.error) {
	// 	res.status(400).send(result.error.details[0].message);
	// 	return;
	// }

	upload2(req, res, async function (err) {
		if (err instanceof multer.MulterError) {
			return res.status(500).json(err);
		} else if (err) {
			return res.status(500).json(err);
		}
		console.log("File ", req.file);

		const mobile = await Mobile.findByIdAndUpdate(
			req.params.id,
			{
				personImage: req.body.personImage,
				personImage2: req.body.personImage2,
				personImage3: req.body.personImage3,
				postingUser: req.body.postingUser,
				category: req.body.category,
				mobilename: req.body.mobilename,
				//date: req.body.date,
				company: req.body.company,
				ime: req.body.ime,
				color: req.body.color,
				type: req.body.type,
				city: req.body.city,
				province: req.body.province,
				area: req.body.area,
				details: req.body.details,
				contactName: req.body.contactName,
				contactNumber: req.body.contactNumber,
				contactAddress: req.body.contactAddress,
			},
			{ new: true }
		);
		if (!mobile) {
			res.status(404).send("No user with this id");
			return;
		}

		res.send(mobile);
	});
});

router.put("/vehicle/:id", function (req, res) {
	// const result = validateUser(req.body, req.file);
	// if (result.error) {
	// 	res.status(400).send(result.error.details[0].message);
	// 	return;
	// }

	upload2(req, res, async function (err) {
		if (err instanceof multer.MulterError) {
			return res.status(500).json(err);
		} else if (err) {
			return res.status(500).json(err);
		}
		console.log("File ", req.file);

		const vehicle = await Vehicle.findByIdAndUpdate(
			req.params.id,
			{
				personImage: req.body.personImage,
				personImage2: req.body.personImage2,
				personImage3: req.body.personImage3,
				postingUser: req.body.postingUser,
				category: req.body.category,
				carname: req.body.carname,
				//date: req.body.date,
				company: req.body.company,
				platenumber: req.body.platenumber,
				color: req.body.color,
				type: req.body.type,
				city: req.body.city,
				province: req.body.province,
				area: req.body.area,
				details: req.body.details,
				contactName: req.body.contactName,
				contactNumber: req.body.contactNumber,
				contactAddress: req.body.contactAddress,
			},
			{ new: true }
		);
		if (!vehicle) {
			res.status(404).send("No user with this id");
			return;
		}

		res.send(vehicle);
	});
});

router.delete("/:id", async (req, res) => {
	const person = await Person.findByIdAndRemove(req.params.id);
	if (!person) {
		res.status(404).send("No user with this id");
		return;
	}

	res.send(person);
});

router.delete("/user/:id", async (req, res) => {
	const user = await User.findByIdAndRemove(req.params.id);
	if (!user) {
		res.status(404).send("No user with this id");
		return;
	}

	res.send(user);
});

function validateUser(user) {
	const schema = {
		category: Joi.string(),
		name: Joi.string().min(3).required(),
		city: Joi.string().min(3).required(),
		age: Joi.number().required(),
		date: Joi.date().required(),
		province: Joi.string().min(3).required(),
		area: Joi.string(),
		details: Joi.string(),
		contactName: Joi.string().min(3).required(),
		contactNumber: Joi.string().min(11).required(),
		contactAddress: Joi.string(),
	};

	return Joi.validate(user, schema);
}

function validateImage(user) {
	const schema = {
		personImage: Joi.string().required(),
	};

	return Joi.validate(user, schema);
}

function validateLogin(req) {
	const schema = {
		email: Joi.string().min(5).max(20).required().alphanum(),
		password: Joi.string().min(5).max(100).required(),
	};

	return Joi.validate(req, schema);
}
module.exports = router;
