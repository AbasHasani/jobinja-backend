const router = require("express").Router();
const Requests = require("../schemas/requests");
const Employer = require("../schemas/employers");
const User = require("../schemas/users");
const { usersVerifyer, employersVerifyer } = require("../verifyer/verifyer");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "14abbas.hassani@gmail.com",
    pass: "lrsbhtliqneazvwj",
  },
});

router.get("/", async (req, res) => {
  try {
    const requests = await Requests.find().exec();
    res.status(200).send(requests);
  } catch (err) {
    res.status(500).send(err);
  }
});
router.get("/employer", async (req, res) => {
  try {
    console.log(req.query.id);
    const requests = await Requests.find({
      "employer.id": req.query.id,
    }).exec();
    console.log("Requests: ", requests);
    res.status(200).send(requests);
  } catch (err) {
    res.status(500).send(err);
  }
});
router.get("/user", async (req, res) => {
  try {
    const requests = await Requests.find({ "user.id": req.query.id }).exec();
    res.status(200).send(requests);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.post("/offer", employersVerifyer, async (req, res) => {
  try {
    const requests = await Requests.findOneAndUpdate(
      { _id: req.body.id },
      { status: req.body.offer },
      { new: true }
    ).exec();
    const user = await User.findOneAndUpdate(
      { _id: requests.user.id },
      { $inc: { notifications: 1 } },
      { new: true }
    ).exec();
    const mailOptions = {
      from: "14abbas.hassani@gmail.com",
      to: user.email,
      subject: "Someome has requested for your job.",
      text: `Your offer has been ${req.body.offer}`,
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
        // res.send("Error");
      } else {
        console.log("Email sent: " + info.response);
        // res.send("Hey");
      }
    });
    res.status(200).send(requests);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.delete("/deleteOne", usersVerifyer, async (req, res) => {
  try {
    const requests = await Requests.findOneAndDelete({
      _id: req.query.id,
    }).exec();
    res.status(200).send(requests);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.post("/post", usersVerifyer, async (req, res) => {
  const userHasRequestedBefore = await Requests.findOne({
    "user.id": req.user._id,
    "job.id": req.body.job.id,
  });

  console.log("User",userHasRequestedBefore);
  if (userHasRequestedBefore) {
    return res.send("User has requested before");
  }
  const request = new Requests({
    user: {
      id: req.user._id,
      username: req.body.user.username,
      photo: req.body.user.photo,
      resumeId: req.body.user.resumeId,
    },
    job: {
      id: req.body.job.id,
      title: req.body.job.title,
      employer: {
        id: req.body.employer.id,
        name: req.body.employer.name,
        photo: req.body.employer.photo,
        address: req.body.employer.address,
      },
    },
  });
  try {
    const employer = await Employer.findOneAndUpdate(
      { _id: req.body.employer.id },
      { $inc: { notifications: 1 } },
      { new: true }
    ).exec();
    const mailOptions = {
      from: "14abbas.hassani@gmail.com",
      to: employer.email,
      subject: "Someome has requested for your job.",
      text: `${req.body.user.username} wants to take the ${req.body.job.title} role
      Link: http://localhost:3000/company/requests?id=${req.body.employer.id}
      `,
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
        // res.send("Error");
      } else {
        console.log("Email sent: " + info.response);
        // res.send("Hey");
      }
    });
    request.save();
    res.status(200).send("here we are");
  } catch (err) {
    res.status(500).send(err);
  }
});



router.post(
  "/clearEmployerNotification",
  employersVerifyer,
  async (req, res) => {
    try {
      const employer = await Employer.findOneAndUpdate(
        { _id: req.employer._id },
        { notifications: 0 },
        { new: true }
      ).exec();
      res.status(200).send(employer);
    } catch (err) {
      res.status(500).send(err);
    }
  }
);

router.post("/clearUserNotification", usersVerifyer, async (req, res) => {
  try {
    const employer = await User.findOneAndUpdate(
      { _id: req.user._id },
      { notifications: 0 },
      { new: true }
    ).exec();
    res.status(200).send(employer);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.delete("/deleteAll", async (req, res) => {
  try {
    const deleted = await Requests.deleteMany().exec();
    res.status(200).send(deleted);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.post("/email", async (req, res) => {});

module.exports = router;
