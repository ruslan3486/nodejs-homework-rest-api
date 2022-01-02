const Joi = require('joi');

const postSchema = Joi.object({
    name: Joi.string().min(2).required(),
    email: Joi.string().required(),
    phone: Joi.string().required(),
    favorite: Joi.boolean(),
}).or('name', 'email', 'phone', 'favorite');

module.exports = postSchema;