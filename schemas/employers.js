const mongoose = require("mongoose");

const Introduction = new mongoose.Schema({
  slang: String,
  qouteFrom: String,
  managerWord: String,
  theKey: String,
  keyDescription: String,
  companySpiritPhoto: String,
});

const schema = new mongoose.Schema({
  companyName: {
    type: String,
    required: true,
    min: 2,
    max: 255,
  },
  numberOfJobs: {
    type: Number,
    required: true,
    default: 0,
  },
  notifications: {
    type: Number,
    required: true,
    default: 0,
  },
  companyLogo: { type: String, default: "" },
  companyImage: { type: String, default: "" },
  introduction: {
    type: Introduction,
    default: {
      slang: "",
      qouteFrom: "",
      managerWord: "",
      theKey: "",
      keyDescription: "",
    },
  },
  manager: {
    type: String,
    required: true,
    min: 3,
    max: 255,
  },
  password: {
    type: String,
    required: true,
    min: 8,
    max: 70,
  },
  email: {
    type: String,
    required: true,
    min: 6,
    max: 255,
  },
  type: {
    type: String,
    default: "",
  },
  date: {
    type: Date,
    default: Date.now(),
  },
});

const employer = new mongoose.model("Employer", schema);

module.exports = employer;
