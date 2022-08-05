const mongoose = require("mongoose");

const schema = mongoose.Schema({
    job: {
        id: { type: String, required: true },
        title: { type: String, required: true },
        employer: {
            id: { type: String, required: true },
            photo: { type: String },
            name: { type: String, required: true },
            address: { type: String, required: true }
        }
    },
    user: {
        id: {  type: String, required: true  },
        username: { type: String, required: true },
        photo: { type: String },
        resumeId: { type: String, required: true }
    },
    status: { type: String, required: true, default: "Request in progress" }
});

const model = new mongoose.model("request", schema);

module.exports = model