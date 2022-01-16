const { Schema, model } = require("mongoose");
const Joi = require("joi");

const phoneRegexp = /^[\s(]*\d{3}[)\s]*\d{3}[\s-]?\d{2}[\s-]?\d{2}$/;

const contactSchema = Schema(
    {
        name: {
            type: String,
            required: [true, "Set name for contact"],
            minlength: 2,
        },
        email: {
            type: String,
            required: [true, "Set email for contact"],
            unique: true,
        },
        phone: {
            type: String,
            required: [true, "Set phone for contact"],
            match: phoneRegexp,
            unique: true,
        },
        favorite: {
            type: Boolean,
            default: false,
        },

        owner: {
            type: Schema.Types.ObjectId,
            ref: "user",
        },
    },
    { versionKey: false, timestamps: true }
);

const joiSchema = Joi.object({
    name: Joi.string().min(2).required(),
    email: Joi.string().required(),
    phone: Joi.string().required().pattern(phoneRegexp),
    favorite: Joi.bool(),
});

const Contact = model("contact", contactSchema);

module.exports = { Contact, joiSchema };