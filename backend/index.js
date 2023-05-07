// First, initiate the Optiic lib
const Optiic = require("optiic");
const express = require("express");
var bodyParser = require("body-parser");
const cors = require("cors");
var multer = require("multer");
var fs = require("fs");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 25, // limit each IP to 100 requests per windowMs
});

const storage = multer.memoryStorage();

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "uploads/");
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.originalname.replace(/\s/g, ""));
//   },
// });
const upload = multer({ storage: storage });
const app = express();
const corsOptions = {
  origin: "http://localhost:3002",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors(corsOptions));
app.use(limiter);

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.post("/upload", upload.single("file"), (req, res) => {
  const optiic = new Optiic({
    apiKey: process.env.OPTIIC_KEY,
  });
  console.log("File ", req.file);
  fs.writeFile(req.file.originalname, req.file.buffer, (err) => {
    // Error
    if (err) {
      console.log("ERROR", err);
    }
    // Send to Optiic
    console.log("File written successfully");
    optiic
      .process({
        image: req.file.originalname,
      })
      .then((result) => {
        console.log("OPTIIC RESULT", result);
        res.status(200).send(result);
      })
      .catch((err) => {
        console.log("OPTIIC ERROR", err);
        res.status(400).send(err);
      });
  });
});

app.listen(3001, () => {
  console.log("Server started on port 3001");
});
