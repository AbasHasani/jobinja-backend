const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    min: 4,
    max: 255,
  },
  email: {
    type: String,
    required: true,
    min: 6,
    max: 255,
  },
  password: {
    type: String,
    required: true,
    min: 8,
    max: 255,
  },
  notifications: {
    type: Number,
    required: true,
    default: 0,
  },
  profile: {
    type: String,
    default: "",
  },
  resumeId: {
    type: String,
    required: false,
    min: 3,
    max: 2000,
    default: "",
  },
  date: { type: Date, default: Date.now },
});

const User = new mongoose.model("User", schema);

module.exports = User;
