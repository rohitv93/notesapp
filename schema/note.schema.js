const Joi = require('joi');

const notesschema = Joi.object({

    title: Joi.string(),

    body: Joi.string().required(),

    image: Joi.string(),

})

module.exports = notesschema;
