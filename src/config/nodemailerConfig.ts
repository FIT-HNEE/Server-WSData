//require("dotenv").config();
import nodemailer from 'nodemailer';
const { MAIL_HOST, MAIL_PASSWORD } = process.env
const sendMail = async (email, lastName, url, message) => {
const transport = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: MAIL_HOST,
    pass: MAIL_PASSWORD,
  },
});

  await transport.sendMail({
    from: MAIL_HOST,    
    to: email,                
    subject: `${message}`,                
    html: `<h1>${message}</h1>                
                    <h2>Hello ${lastName}</h2>
                    <p>Thank you for request. Please ${message} by clicking on the following link</p>
                    <a href="${url}"> ${url}</a>
                    </div>`,    
  }).catch(err => console.log(err));
}

export default sendMail;

