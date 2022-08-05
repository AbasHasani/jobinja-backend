const mongoose = require("mongoose");

const Info = new mongoose.Schema({
  title: { type: String, required: true },
  desc: { type: String, default: "" },
  name: { type: String, default: "" },
});

const Experience = new mongoose.Schema({
  title: { type: String, required: true },
  from: { type: String },
  to: { type: String },
  stillWorking: Boolean,
});

const Language = new mongoose.Schema({
  language: { type: String, required: true },
  level: { type: String, required: true },
});

const JobPrefrences = new mongoose.Schema({
  cities: [String],
  jobType: [String],
  jobLevel: {},
  contracts: {},
  salary: Number,
  possiblePromotion: { type: Boolean, default: false },
  insurance: { type: Boolean, default: false },
  educationalPrograms: { type: Boolean, default: false },
  floatingHours: { type: Boolean, default: false },
  transmitService: { type: Boolean, default: false },
  foodOnCompany: { type: Boolean, default: false },
});

const Education = new mongoose.Schema({
  title: { type: String, required: true },
  degree: String,
  university: String,
  stillStudying: { type: Boolean, default: false },
});

const schema = new mongoose.Schema({
  user: { type: String, required: true },
  body: { type: String, default: "" },
  personalInfo: {
    type: [Info],
    default: [
      {
        title: "Number",
        desc: "",
        name: "number",
      },
      {
        title: "Marrage status",
        desc: "",
        name: "marrageStatus",
      },
      {
        title: "Sex",
        desc: "",
        name: "sex",
      },
      {
        title: "Providence of residence",
        desc: "",
        name: "providence",
      },
      {
        title: "Email",
        desc: "",
        name: "email",
      },
      {
        title: "Soldiership",
        desc: "",
        name: "soldiership",
      },
      {
        title: "Date of birth",
        desc: "",
        name: "dateOfBirth",
      },
      {
        title: "Address",
        desc: "",
        name: "address",
      },
    ],
  },
  skills: [String],
  experience: [Experience],
  education: [Education],
  languages: [Language],
  jobPrefrences: {
    type: JobPrefrences,
    default: {
      cities: [],
      jobType: [],
      jobLevel: [
        { title: "Senior", name: "senior", checked: false },
        { title: "Junior", name: "junior", checked: false },
      ],
      contracts: [
        { title: "Full Time", name: "fullTime", checked: false },
        { title: "Part Time", name: "partTime", checked: false },
        { title: "Remote", name: "remote", checked: false },
      ],
      salary: 0,
      possiblePromotion: false,
      insurance: false,
      educationalPrograms: false,
      floatingHours: false,
      transmitService: false,
      foodOnCompany: false,
    },
  },
});

const resume = new mongoose.model("resume", schema);

module.exports = resume;
