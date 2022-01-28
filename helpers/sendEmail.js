const sgMail = require("@sendgrid/mail");
require("dotenv").config();

const { SENDGRID_API_KEY } = process.env;

sgMail.setApiKey(SENDGRID_API_KEY);


const sendEmail = async (data, mail) => {

    try {
        const email = { ...data, from: mail }
        await sgMail.send(email);
        return true
    } catch (err) {
        throw err
    }
}

module.exports = sendEmail;