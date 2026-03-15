const { Resend } = require('resend');

// Initialize Resend with the API Key you added to Render
const resend = new Resend(process.env.RESEND_API_KEY);

const sendOTP = async (email, otp) => {
  try {
    const { data, error } = await resend.emails.send({
      // IMPORTANT: While testing on the free tier, use 'onboarding@resend.dev'
      from: 'Zesto <onboarding@resend.dev>', 
      to: email,
      subject: "Reset Your Password",
      html: `<p>Your OTP for password reset is <b>${otp}</b>. It will expire in 10 minutes.</p>`,
    });

    if (error) {
      return console.error("Resend Error (sendOTP):", error);
    }

    console.log("OTP sent successfully! ID:", data.id);
  } catch (err) {
    console.error("System Error in sendOTP:", err);
  }
};

const sendDeliveryOTP = async (user, otp) => {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Zesto <onboarding@resend.dev>',
      to: user.email,
      subject: "Confirm the Delivery",
      html: `<p>Your OTP for Confirmation Of Delivery is <b>${otp}</b>. It will expire in 10 minutes.</p>`,
    });

    if (error) {
      return console.error("Resend Error (sendDeliveryOTP):", error);
    }

    console.log("Delivery OTP sent successfully! ID:", data.id);
  } catch (err) {
    console.error("System Error in sendDeliveryOTP:", err);
  }
};

module.exports = { sendOTP, sendDeliveryOTP };