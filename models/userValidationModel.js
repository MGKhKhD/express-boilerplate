const Joi = require("joi");

let passwordReg = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{3,}/;

module.exports = {
  signup: {
    body: {
      email: Joi.string()
        .email()
        .required(),
      password: Joi.string()
        .regex(passwordReg)
        .required(),
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      userName: Joi.string().required()
    }
  }
};
