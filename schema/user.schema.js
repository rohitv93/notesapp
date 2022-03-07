const Joi = require('joi');

const userSchema = Joi.object({

    username: Joi.string().required(),

    password: Joi.string().required(),

    email: Joi.string().email().required()

})

const loginSchema = Joi.object({

    password: Joi.string().required(),

    email: Joi.string().email().required()
})

module.exports = { userSchema,  loginSchema }