//require("dotenv").config();
import nodemailer from 'nodemailer';

const transport = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: 'fit.github@gmail.com',
    pass: 'hnee@fit',
  },
});

module.exports.sendConfirmationEmail = (name, email, confirmationCode) => {
  transport.sendMail({
    from: 'fit.github@gmail.com',
    to: email,
    subject: "Please confirm your account",
    html: `<h1>Email Confirmation</h1>
        <h2>Hello ${name}</h2>
        <p>Thank you for subscribing. Please confirm your email by clicking on the following link</p>
        <a href=http://localhost:4000/confirm/${confirmationCode}> Click here</a>
        </div>`,
  }).catch(err => console.log(err));
};