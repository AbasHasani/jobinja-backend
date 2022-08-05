const Joi = require("joi");

const registerSchema = Joi.object({
  username: Joi.string().min(4).max(255).required(),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).required(),
  repeatPassword: Joi.ref("password"),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    })
    .required(),
  resumeId: Joi.string().min(3).required().allow(""),
});

module.exports = registerSchema;
