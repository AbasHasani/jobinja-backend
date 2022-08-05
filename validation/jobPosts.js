const Joi = require("joi");

const Employer = Joi.object({
  employerId: Joi.string().required(),
  companyName: Joi.string().required(),
  companyLogo: Joi.string().allow(""),
  companyImage: Joi.string().allow(""),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    })
    .required(),
});

const jobPostsVali = Joi.object({
  employer: Employer,
  jobType: Joi.string().min(2).max(255).required(),
  jobLevel: Joi.string().max(255).required(),
  inDemand: Joi.string().min(2).required(),
  address: Joi.string().min(3).max(70).required(),
  contract: Joi.array().items(Joi.string()),
  experience: Joi.string().allow(null, ""),
  salary: Joi.string().allow(null, ""),
  skills: Joi.array().items(Joi.string()),
  education: Joi.string().allow(null, ""),
  sex: Joi.string().allow(null, ""),
  soldiership: Joi.array().items(Joi.string()),
  body: Joi.string(),
  title: Joi.string().min(2).max(50).required()
});

module.exports = jobPostsVali;
