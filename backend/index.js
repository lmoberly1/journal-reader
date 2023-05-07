// First, initiate the Optiic lib
const Optiic = require("optiic");
const express = require("express");
var bodyParser = require("body-parser");
const cors = require("cors");
var multer = require("multer");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 25, // limit each IP to 100 requests per windowMs
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname.replace(/\s/g, ""));
  },
});
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
  optiic
    .process({
      image: req.file.path,
      // image: "uploads/test.jpeg",
      // image: "https://optiic.dev/assets/images/samples/we-love-optiic.png",
    })
    .then((result) => {
      console.log("Result", result);
      res.send(result);
    })
    .catch((err) => {
      console.log("Error", err);
      res.send(err);
    });
});

app.listen(3001, () => {
  console.log("Server started on port 3001");
});
