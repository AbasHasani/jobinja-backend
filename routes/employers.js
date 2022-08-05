const router = require("express").Router();
const bycript = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Employer = require("../schemas/employers");
const Job = require("../schemas/jobPosts");
const { empLoginVali, empRegisterVali } = require("../validation/employers");
const { employersVerifyer } = require("../verifyer/verifyer");

router.post("/register", async (req, res) => {
  //Check if employer already exists
  const alreadyExists = await Employer.findOne({ email: req.body.email });
  if (alreadyExists) {
    return res.status(400).send("Employer's email already exists");
  }
  // Hash the password
  const salt = await bycript.genSalt(10);
  const hashedPassword = await bycript.hash(req.body.password, salt);
  //Create employer - step 1
  const employer = new Employer({
    companyName: req.body.companyName,
    manager: req.body.manager,
    password: hashedPassword,
    email: req.body.email,
  });

  try {
    //Validate user inputs
    console.log(req.body);
    const employerValidation = await empRegisterVali.validateAsync(req.body);

    if (!employerValidation.manager) {
      console.log("Not passed the validation");
      res.status(400).send(employerValidation);
    } else {
      const savedEmployer = await employer.save();
      res.status(200).json(savedEmployer);
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

router.post("/login", async (req, res) => {
  // If employer is signed in
  const employer = await Employer.findOne({ email: req.body.email });
  if (!employer) return res.status(400).send("No employer with this email");
  console.log("Passed email");
  // Checking the password
  const validPass = await bycript.compare(req.body.password, employer.password);
  if (!validPass) return res.status(400).send("Wrong password");
  console.log("Passed password");
  try {
    // Validate user inputs
    const employerValidation = await empLoginVali.validateAsync(req.body);

    if (!employerValidation.email) {
      console.log("Not passed the validation");
      res.status(400).send(employerValidation);
    } else {
      const token = jwt.sign({ _id: employer._id }, process.env.TOKEN_SECRET_E);
      res.setHeader("auth-token", token).send(token);
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

router.get("/employerInfo", employersVerifyer, async (req, res) => {
  try {
    const employers = await Employer.findOne({ _id: req.employer._id }).exec();
    res.status(200).json(employers);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.get("/otherEmployerInfo", async (req, res) => {
  try {
    const employer = await Employer.findOne({ _id: req.query.id }).exec();
    res.status(200).json(employer);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.get("/getSpeceficEmployers", async (req, res) => {
  console.log(req.query.companyName, req.query.type);
  try {
    const employers = await Employer.find({
      companyName: { $regex: req.query.companyName || "", $options: "i" },
      type: { $regex: req.query.type || "", $options: "i" },
    }).exec();
    console.log(employers);
    res.status(200).send(employers)
  } catch (err) {
    console.log("Not working");
    res.status(500).send(err)
  }
});

router.get("/", async (req, res) => {
  try {
    const employers = await Employer.find().exec();
    res.status(200).json(employers);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.get("/topFifty", async (req, res) => {
  try {
    const employers = await Employer.find().exec();
    const sortedEmployers = employers.sort(
      (a, b) => b.numberOfJobs - a.numberOfJobs
    );
    res.status(200).send(sortedEmployers);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.post("/updateCompany", employersVerifyer, async (req, res) => {
  try {
    const employer = await Employer.findOneAndUpdate(
      { _id: req.employer._id },
      {
        companyName: req.body.companyName,
        companyLogo: req.body.companyLogo,
        companyImage: req.body.companyImage,
        manager: req.body.manager,
        email: req.body.email,
        introduction: req.body.introduction,
        type: req.body.type,
      },
      { new: true }
    );
    console.log(employer);
    res.status(200).send(employer);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.delete("/deleteAll", async (req, res) => {
  try {
    const employers = await Employer.deleteMany().exec();
    res.status(200).json(employers);
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
