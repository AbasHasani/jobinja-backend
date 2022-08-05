const Joi = require("joi");

const Info = Joi.object({
  title: Joi.string().required(),
  desc: Joi.string().allow(""),
});

const Experience = Joi.object({
  title: Joi.string().required(),
  from: Joi.string(),
  to: Joi.string(),
  stillWorking: Joi.boolean(),
});

const Language = Joi.object({
  language: Joi.string().required(),
  level: Joi.string().required(),
});

const JobPrefrences = Joi.object({
  cities: Joi.array().items(Joi.string().allow("")),
  jobType: Joi.array().items(Joi.string().allow("")),
  jobLevel: Joi.any(),
  contracts: Joi.any(),
  salary: Joi.string().allow(""),
  possiblePromotion: Joi.boolean(),
  insurance: Joi.boolean(),
  educationalPrograms: Joi.boolean(),
  floatingHours: Joi.boolean(),
  transmitService: Joi.boolean(),
  foodOnCompany: Joi.boolean(),
});

const Education = Joi.object({
  title: Joi.string().required(),
  degree: Joi.string().required(),
  university: Joi.string(),
  stillStudying: Joi.boolean(),
});

const resumeVali = Joi.object({
  user: Joi.string().required(),
  body: Joi.string().allow(""),
  personalInfo: Joi.array().items(Info),
  skills: Joi.array().items(Joi.string()),
  experience: Joi.array().items(Experience),
  education: Joi.array().items(Education),
  languages: Joi.array().items(Language),
  jobPrefrences: JobPrefrences,
});

module.exports = resumeVali;

// {
//     "body": "Hello im abas and very glad to see you",
//     "personalInfo": [{"title": "Number", "desc": "09916224383"},{"title": "Address", "desc": "Tehran"}],
//     "skills": ["React", "next"],
//     "experience": [
//         {
//             "title": "React developer",
//             "from": "One year ago",
//             "to": "Today",
//             "stillWorking": true
//         }
//     ],
//     "education": "High scholl",
//     "languages": [{"language": "English", "level": "Pro"}],
//     "jobPrefrences": {
//         "cities": ["Tehran", "Ahwaz"],
//         "jobType": ["Remote", "Full Time"],
//         "jobLevel": ["Senior", "Junior", "Intern"],
//         "contracts": ["Full time"],
//         "salary": "From 8",
//         "possiblePromotion": true,
//         "insurance": false,
//         "educationalPrograms": true,
//         "floatingHours": true,
//         "transmitService": true,
//         "foodCompany": false
//     }
// }
