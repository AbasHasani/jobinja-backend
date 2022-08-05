const mongoose = require("mongoose");

const Employer = mongoose.Schema({
  employerId: { type: String, required: true },
  companyName: { type: String, required: true },
  companyLogo: String,
  companyImage: String,
  email: { type: String, required: true, min: 6, max: 255 },
});

const schema = new mongoose.Schema({
  title: { type: String, required: true },
  employer: {
    type: Employer,
    required: true,
  },
  jobType: {
    type: String,
    required: true,
    min: 2,
    max: 255,
  },
  jobLevel: {
    type: String,
    required: true,
    min: 2,
    max: 255,
  },
  address: {
    type: String,
    required: true,
    min: 3,
    max: 70,
  },
  contract: {
    type: [String],
    required: true,
    min: 3,
    max: 70,
  },
  skills: {
    type: [String],
    required: true,
  },
  experience: {
    type: String,
    min: 1,
    max: 70,
    default: "",
  },
  salary: {
    type: String,
    min: 1,
    max: 255,
    default: "",
  },
  sex: {
    type: String,
    min: 3,
    max: 5,
    default: "",
  },
  education: {
    type: String,
    default: "",
  },
  inDemand: {
    type: String,
    required: true,
    default: "No"
  },
  soldiership: {
    type: [String],
    default: [],
  },
  body: {
    type: String,
    default: "",
  },
  date: { type: Date, default: Date.now },
});

const jobPosts = new mongoose.model("jobPost", schema);

module.exports = jobPosts;
