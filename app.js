// Package Impots
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const connection = require("./db");
const Grid = require("gridfs-stream");
const dotenv = require("dotenv");
// Route Imports
const users = require("./routes/users");
const employers = require("./routes/employers");
const jobs = require("./routes/jobs");
const resume = require("./routes/resumes");
const upload = require("./routes/upload");
const { employersVerifyer } = require("./verifyer/verifyer");
const Employer = require("./schemas/employers");
const requests = require("./routes/requests")
// Initilizing express app
const app = express();
const port = process.env.local || 4000;
// Using stuff on app
app.use(express.json());
app.use(cors());
// Using the routes
app.use("/users", users);
app.use("/employers", employers);
app.use("/jobs", jobs);
app.use("/resume", resume);
app.use("/file", upload);
app.use("/requests", requests)

// configuiring dotenv
dotenv.config();

let gfs;
let gridfsBucket;
connection();

// Connecting to mongodb
const conn = mongoose.connection;
conn.once("open", async function () {
  gridfsBucket = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: "photos",
  });
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection("photos");
});

app.get("/file/:filename", async (req, res) => {
  try {
    const file = await gfs.files.findOne({ filename: req.params.filename });
    // const readStream = gfs.createReadStream(file.filename);
    const readStream = gridfsBucket.openDownloadStream(file._id);
    readStream.pipe(res);
  } catch (err) {
    console.log(err);
    res.send("Not Found");
  }
});

app.post("/file/:filename", employersVerifyer, async (req, res) => {
  try {
    const deletedImage = await gfs.files.deleteOne({
      filename: req.params.filename,
    });
    let employerImage;
    if (
      req.body.whatImage === "companyLogo" ||
      req.body.whatImage === "companyImage"
    ) {
      employerImage = { [req.body.whatImage]: "" };
    } else {
      employerImage = { introduction: { [req.body.whatImage]: "" } };
    }
    const changedEmployer = await Employer.findOneAndUpdate(
      {
        _id: req.employer._id,
      },
      employerImage,
      { new: true }
    );
    res.send("Success");
  } catch (error) {
    res.send("An error happende");
  }
});

app.listen(port, () => console.log(`Listening at http://localhost:${port}`));
