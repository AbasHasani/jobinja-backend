const express = require("express");
const router = express.Router();
const User = require("../schemas/users");
const registerValidation = require("../validation/register");
const loginValidation = require("../validation/login");
const bycript = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { usersVerifyer: verifyer } = require("../verifyer/verifyer");

router.post("/register", async (req, res) => {
  // Check if user already exists
  const alreadyExists = await User.findOne({ email: req.body.email });
  if (alreadyExists) {
    res.status(400).send("Email already exsists");
    return;
  }
  // Hash the password
  const salt = await bycript.genSalt(10);
  const hashedPassword = await bycript.hash(req.body.password, salt);
  // Create user
  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: hashedPassword,
  });
  try {
    //Validation of user inputs
    console.log({
      ...req.body,
      resumeId: "",
    });
    const userValidation = await registerValidation.validateAsync({
      ...req.body,
      resumeId: "",
    });
    console.log("Start of the try.catch: ", userValidation);
    if (!userValidation.username) {
      res.status(400).send("error.details[0].message");
      return;
    } else {
      const savedUser = await user.save();
      res.status(200).send("user created");
    }
  } catch (error) {
    console.log("Error");
    res.status(500).send(error);
  }
});

router.post("/login", async (req, res) => {
  //Check if the user is signed in
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(400).send("No user with this email");
  }
    //Check the password
  const rightPass = await bycript.compare(req.body.password, user.password);
  if (!rightPass) return res.status(400).send("Wrong password bitch");
  try {
    const {error, value} = await loginValidation.validateAsync(req.body);
    console.log({error, value});
    if (!userValidation.email) {
      console.log("in the if not");
      res.status(400).send(userValidation);
      return;
    } else {
      console.log("in the if yes");
      //Sending back the token
      const token = jwt.sign(
        {
          _id: user._id,
        },
        process.env.TOKEN_SECRET
      );
      res.setHeader("auth-token", token).send(token);
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

router.get("/userInfo", verifyer, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user._id });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.get("/userInfoEmployer", async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.query.id });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.delete("/delete", verifyer,async (req, res) => {
  try {
    const deletedUser = await User.findOneAndDelete({ _id: req.user._id });
    res.status(200).json(deletedUser);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.delete("/deleteAll", verifyer,async (req, res) => {
  try {
    const deletedUsers = await User.deleteMany();
    res.status(200).json(deletedUsers);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.get("/", async (req, res) => {
  try {
    const users = await User.find().exec();
    res.json(users);
  } catch (err) {
    res.status(400).send(err);
  }
});

module.exports = router;
