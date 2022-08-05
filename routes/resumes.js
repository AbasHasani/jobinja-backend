const router = require("express").Router();
const { usersVerifyer } = require("../verifyer/verifyer");
const resumeVali = require("../validation/resumes");
const Resume = require("../schemas/resumes");
const User = require("../schemas/users");

router.post("/create", usersVerifyer, async (req, res) => {
  //Check if already has a resume
  const alreadyHas = await Resume.findOne({ user: req.user._id });
  if (alreadyHas) {
    console.log(alreadyHas);
    res.status(400).send("You already have a resume");
    return;
  }

  const resume = new Resume({ user: req.user._id });
  try {
    const resumeValidation = await resumeVali.validateAsync({
      user: req.user._id,
    });
    if (!resumeValidation.user) {
      console.log("Validation failed");
      res.status(400).send(resumeValidation);
    } else {
      const savedResume = await resume.save();
      const changedUser = await User.findOneAndUpdate(
        { _id: req.user._id },
        { resumeId: savedResume._id }
      ).exec();
      res.status(200).json(savedResume);
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

//Update resumes

//Update body
router.post("/update/body", async (req, res) => {
  try {
    const resume = await Resume.findOneAndUpdate(
      { _id: req.body._id },
      { body: req.body.body },
      { new: true }
    ).exec();
    res.status(200).json(resume);
  } catch (err) {
    res.status(500).send(err);
  }
});
//Update personalInfo
router.post("/update/userinfo", async (req, res) => {
  try {
    const resume = await Resume.findOneAndUpdate(
      { _id: req.body._id },
      { personalInfo: req.body.personalInfo },
      { new: true }
    ).exec();
    res.status(200).json(resume);
  } catch (err) {
    res.status(500).send(err);
  }
});

//Update skills
router.post("/update/skills", async (req, res) => {
  try {
    const resume = await Resume.findOneAndUpdate(
      { _id: req.body._id },
      { skills: req.body.skills },
      { new: true }
    ).exec();
    res.status(200).json(resume);
  } catch (err) {
    res.status(500).send(err);
  }
});
//Upate experience
router.post("/update/experience", async (req, res) => {
  try {
    const resume = await Resume.findOneAndUpdate(
      { _id: req.body._id },
      { experience: req.body.experience },
      { new: true }
    ).exec();
    res.status(200).json(resume);
  } catch (err) {
    res.status(500).send(err);
  }
});
//Update education
router.post("/update/education", async (req, res) => {
  try {
    const resume = await Resume.findOneAndUpdate(
      { _id: req.body._id },
      { education: req.body.education },
      { new: true }
    ).exec();
    res.status(200).json(resume);
  } catch (err) {
    res.status(500).send(err);
  }
});
//Update languages
router.post("/update/languages", async (req, res) => {
  try {
    const resume = await Resume.findOneAndUpdate(
      { _id: req.body._id },
      { languages: req.body.languages },
      { new: true }
    ).exec();
    res.status(200).json(resume);
  } catch (err) {
    res.status(500).send(err);
  }
});

//Update jobPrefrences
router.post("/update/jobprefrences", async (req, res) => {
  try {
    const resume = await Resume.findOneAndUpdate(
      { _id: req.body._id },
      { jobPrefrences: req.body.jobPrefrences },
      { new: true }
    ).exec();
    res.status(200).json(resume);
  } catch (err) {
    res.status(500).send(err);
  }
});

//Get all the Resumes
router.get("/all", async (req, res) => {
  try {
    const resumes = await Resume.find().exec();
    res.status(200).json(resumes);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Delete Resume

router.post("/delete", usersVerifyer, async (req, res) => {
  try {
    const resume = await Resume.findOneAndDelete({ user: req.user._id });
    res.status(200).send(resume);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.get("/resumeInfo", async (req, res) => {
  try {
    console.log("Hey there");
    const resume = await Resume.findOne({ _id: req.query._id }).exec();
    console.log("resume", resume);
    res.status(200).send(resume);
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
