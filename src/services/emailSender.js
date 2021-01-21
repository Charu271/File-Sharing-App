const nodemailer = require("nodemailer");
//const sgMail = require("@sendgrid/mail");
//sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const sendMail = async ({ sendTo, sendFrom, subject, text, html }) => {
  // const msg = {
  //   to: sendTo,
  //   from: sendFrom,
  //   subject,
  //   text,
  //   html,
  // };
  // sgMail
  //   .send(msg)
  //   .then(() => {
  //     console.log("Email sent");
  //   })
  //   .catch((error) => {
  //     console.error(error);
  //     console.log(error);
  //   });
  const transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false, //465
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const info = await transport.sendMail({
    from: sendFrom,
    to: sendTo,
    subject,
    text,
    html,
  });
};
module.exports = sendMail;
