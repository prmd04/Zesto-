const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false, 
  auth: {
    user: process.env.GMAIL,
    pass: process.env.APP_PASS,
  },
  tls: {
    rejectUnauthorized: false 
  }
});

const sendOTP = async(email, otp) => {
  try {
    await transporter.sendMail({
      from: process.env.GMAIL,
      to: email,
      subject: "Reset Your Password",
      html: `<p>Your OTP for password reset is <b>${otp}</b>. It will expire in 10 minutes.</p>`
    });
    console.log("OTP sent successfully to:", email);
  } catch (err) {
    console.log("Error in sendOTP:", err);
  }
}

const sendDeliveryOTP = async(user, otp) => {
  try {
    await transporter.sendMail({
      from: process.env.GMAIL,
      to: user.email,
      subject: "Confirm the Delivery",
      html: `<p>Your OTP for Confirmation Of Delivery is <b>${otp}</b>. It will expire in 10 minutes.</p>`
    });
    console.log("Delivery OTP sent successfully to:", user.email);
  } catch (err) {
    console.log("Error in sendDeliveryOTP:", err);
  }
}

module.exports = { sendOTP, sendDeliveryOTP };