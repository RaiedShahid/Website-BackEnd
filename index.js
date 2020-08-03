const mongoose = require("mongoose");
const https = require("https");
const express = require("express");
const app = express();
const personInfo = require("./Routes/personInfo");
const fs = require("fs");

//const cors = require("cors");

const mongodb_uri =
	"mongodb+srv://Fur619:furqanfyp@fypcluster-zq8ux.mongodb.net/test?retryWrites=true&w=majority";

mongoose
	.connect(mongodb_uri || "mongodb://localhost/FypDatabase")
	.then(() => console.log("Connected to MongoDB"))
	.catch((err) => console.error("Cannot connect database", err));

// app.use(cors());
app.use(express.json());

app.use(function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
	res.header("Access-Control-Allow-Headers", "*");

	next();
});
app.use("/home/uploads", express.static("uploads"));

app.use("/home", personInfo);
// const httpServer = http.createServer(app);
const httpsServer = https.createServer(
	// {
	// 	key: fs.readFileSync("/etc/letsencrypt/live/my_api_url/privkey.pem"),
	// 	cert: fs.readFileSync("/etc/letsencrypt/live/my_api_url/fullchain.pem"),
	// },
	app
);

// httpsServer.listen(4000, () => {
// 	console.log("HTTPS Server running on port 443");
// });

app.listen(4000, () => console.log("Listening on port 4000"));
