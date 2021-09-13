import nodemailer from 'nodemailer';

export const transport = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: 'pakswim@gmail.com',
    pass: 'Moonstar@1987',
  },
});