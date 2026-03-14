const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL,
    pass: process.env.APP_PASS,
  },
});

const sendOTP = async(email,otp)=>{
  try{
    await transporter.sendMail({
      from:process.env.GMAIL,
      to:email,
      subject:"Reset Your Password",
      html:`<p>Your OTP for password reset is <b>${otp}</b>. It will expire in 10 minutes.</p>`
    })
  }catch(err){
    console.log(err);
  }
}
const sendDeliveryOTP = async(user,otp)=>{
  try{
    await transporter.sendMail({
      from:process.env.GMAIL,
      to:user.email,
      subject:"Confirm the Delivery",
      html:`<p>Your OTP for Confirmation Of Delivery is <b>${otp}</b>. It will expire in 10 minutes.</p>`
    })
  }catch(err){
    console.log(err);
  }
}
module.exports= {sendOTP,sendDeliveryOTP};

