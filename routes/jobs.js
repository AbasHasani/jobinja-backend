const router = require("express").Router();
const { employersVerifyer } = require("../verifyer/verifyer");
const Job = require("../schemas/jobPosts");
const Employer = require("../schemas/employers");
const jobPostsVali = require("../validation/jobPosts");

router.post("/post", employersVerifyer, async (req, res) => {
  const jobInfo = {
    employer: {
      employerId: req.employer._id,
      companyName: req.body.companyName,
      companyLogo: req.body.companyLogo || "",
      companyImage: req.body.companyImage || "",
      email: req.body.email,
    },
    jobType: req.body.jobType,
    jobLevel: req.body.jobLevel,
    address: req.body.address,
    inDemand: req.body.inDemand,
    contract: req.body.contract,
    skills: req.body.skills,
    experience: req.body.experience || "",
    body: req.body.body || "",
    salary: req.body.salary || "",
    sex: req.body.sex || "",
    education: req.body.education || "",
    soldiership: req.body.soldiership || [],
    title: req.body.title,
  };
  const job = new Job(jobInfo);
  try {
    // console.log(jobInfo);
    const jobValidation = await jobPostsVali.validateAsync(jobInfo);

    if (!jobValidation.contract) {
      console.log("Did not pass the validation");
      res.status(400).send(jobValidation);
    } else {
      const savedJobPost = await job.save();
      console.log("In the yes");
      const addOneJobToEmployer = await Employer.findOneAndUpdate(
        { _id: req.employer._id },
        { $inc: { numberOfJobs: 1 } },
        { new: true }
      ).exec();
      console.log("PAssed");
      console.log(addOneJobToEmployer);
      res.status(200).json({ savedJobPost, addOneJobToEmployer });
    }
  } catch (error) {
    res.status(500).send(error);
  }
});
router.delete("/deleteOne", employersVerifyer, async (req, res) => {
  try {
    const deleted = await Job.findOneAndDelete({ _id: req.body._id }).exec();
    if(deleted === null){
      return res.status(400).send("Did not find the job")
    }
    console.log(deleted);
    const decrementOneFromJob = await Employer.findOneAndUpdate(
      { _id: req.employer._id },
      { $inc: { numberOfJobs: -1 } },
      { new: true }
    ).exec();
    res.status(200).send({ decrementOneFromJob });
  } catch (err) {
    res.status(500).send(err);
  }
});
router.delete("/deleteAll", async (req, res) => {
  try {
    const deleted = await Job.deleteMany().exec();
    res.status(200).send(deleted);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.get("/jobInfo", async (req, res) => {
  try {
    console.log(req.query.providence);
    const jobs = await Job.find({
      title: { $regex: req.query.title || "", $options: "i" },
      jobType: { $regex: req.query.jobType || "", $options: "i" },
      contract: { $regex: req.query.contract || "", $options: "i" },
      experience: { $regex: req.query.experience || "", $options: "i" },
      address: { $regex: req.query.address || "", $options: "i" },
      skills: { $regex: req.query.skills || "", $options: "i" },
      salary: { $regex: req.query.salary || "", $options: "i" },
    }).exec();
    res.status(200).send(jobs);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.get("/jobInfoOne", async (req, res) => {
  try {
    const jobs = await Job.findById(req.query.id).exec();
    res.status(200).send(jobs);
  } catch (err) {
    res.status(500).send(err);
  }
});


router.get("/companyJobs", async (req, res) => {
  try {
    const jobs = await Job.find({ "employer.employerID": req.query.id });
    res.status(200).send(jobs);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.get("/", async (req, res) => {
  try {
    const jobs = await Job.find().exec();
    res.status(200).send(jobs);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Job Body sample
// {
//   "companyName": "Telegram",
//   "companyLogo": "",
//   "companyImage": "",
//   "email": "farshad@gmail.com",
//   "title": "Raect developer",
//   "jobType": "Web dev",
//   "address": "Tehran",
//   "contract": [
//       "Full Time",
//       "Part Time"
//   ],
//   "skills": [
//       "Node js"
//   ],
//   "experience": "Less than 3 years",
//   "body": "NONE",
//   "salary": "From 20",
//   "sex": "Man",
//   "education": "Diploma",
//   "soldiership": ["Not Inportant"]
// }

module.exports = router;
