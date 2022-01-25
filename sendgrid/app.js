const mail = require("@sendgrid/mail");
const sgMail = require("@sendgrid/mail");
require("dotenv").config()

const { SENDGRID_API_KEY } = process.env;

sgMail.setApiKey(SENDGRID_API_KEY);

const email = {

    to: "jelijof582@get2israel.com",
    from: "kuzrus31@gmail.com",
    subject: "Новая завка с сайта",
    html: "<p>Ваша заявка принята</p>"
}

sgMail.send(email).then(() => console.log("Email send success"))
    .catch(error => console.log(error.message))