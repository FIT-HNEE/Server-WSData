import nodemailer from 'nodemailer';

const sendMail = async (email, lastName, url, message) => {
const transport = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: 'pakswim@gmail.com',
    pass: 'Moonstar@1987',
  },
});

  await transport.sendMail({
    from: 'pakswim@gmail.com',    
    to: email,                
    subject: `${message}`,                
    html: `<h1>${message}</h1>                
                    <h2>Hello ${lastName}</h2>
                    <p>Thank you for request. Please ${message} by clicking on the following link</p>
                    <a href="${url}"> ${url}</a>
                    </div>`,    
  })
}

export default sendMail;

