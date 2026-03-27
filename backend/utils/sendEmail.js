const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = async (to, subject, text) => {
  const msg = {
    to,
    from: "zesto.delivery.app@gmail.com",
    subject,
    text,
  };

  await sgMail.send(msg);
};

module.exports = sendEmail;