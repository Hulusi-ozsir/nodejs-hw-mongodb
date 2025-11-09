const Joi = require('joi');

const sendResetEmailSchema = Joi.object({
  email: Joi.string().email().required()
});

const resetPasswordSchema = Joi.object({
  token: Joi.string().required(),
  password: Joi.string().min(6).required()
});

module.exports = {
  sendResetEmailSchema,
  resetPasswordSchema
};