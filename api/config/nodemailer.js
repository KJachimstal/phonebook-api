const nodemailer = require("nodemailer");

require("dotenv").config();

const config = {
  host: "smtp.sendgrid.net",
  port: 587,
  secure: true,
  auth: {
    user: "apikey",
    pass: process.env.MAIL_API_KEY,
  },
};

const transporter = nodemailer.createTransport(config);

module.exports = {
  transporter,
};
