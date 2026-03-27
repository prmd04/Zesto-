const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const generateToken = require("../utils/generateToken");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail")

const signup = async (req, res) => {
  try {
    const { fullName, email, password, mobileNumber, role } = req.body;
    let user = await User.findOne({ email });

    if (user) {
      return res.status(409).json({ message: "User already exists" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "password must be more than six character" });
    }

    if (mobileNumber.length < 10) {
      return res
        .status(400)
        .json({ message: "mobile number must be 10 digit" });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    user = await User.create({
      fullName,
      email,
      password: hashPassword,
      mobile: mobileNumber,
      role,
    });

    const token = await generateToken(user._id);
    res.cookie("token", token, {
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });

    // Sanitize user object (remove password)
    const userResponse = user.toObject();
    delete userResponse.password;

    return res.status(201).json(userResponse);
  } catch (err) {
    return res
      .status(500)
      .json({ message: `unable to sign up ${err.message}` });
  }
};

const signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "user does not exits" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res
        .status(401)
        .json({ message: "invalid user name or password!" });
    }

    const token = await generateToken(user._id);
    res.cookie("token", token, {
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });
    const userResponse = user.toObject();
    delete userResponse.password;

    return res.status(200).json(userResponse);
  } catch (err) {
    return res
      .status(500)
      .json({ message: `unable to sign in ${err.message}` });
  }
};

const signout = async (req, res) => {
  try {
    res.clearCookie("token");
    return res.status(200).json({ message: "log out succesfully!" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: `unable to sign out ${error.message}` });
  }
};

const sendotp = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "user does not exits" });
    }
    const otp = crypto.randomInt(100000, 999999).toString();
    user.resetPasswordOTP = otp;
    user.resetPasswordExpiry = Date.now() + 10 * 60 * 1000;

    await user.save();

    await sendEmail(email, "OTP Code", `Your OTP for password reset is ${otp}. This code will expire in 10 minutes. If you did not request a password reset, please ignore this email.`);

    return res.status(200).json({ message: "OTP sent successfully!" });
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

const verifyotp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });
    if (
      !user ||
      user.resetPasswordOTP !== otp ||
      user.resetPasswordExpiry < Date.now()
    ) {
      return res.status(400).json({ message: "invalid otp" });
    }
    user.verified = true;
    user.resetPasswordOTP = undefined;
    user.resetPasswordExpiry = undefined;
    await user.save();
    return res.status(200).json({ message: "user verified successfully!" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: `unable to verify otp ${error.message}` });
  }
};

const resetpassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    console.log(newPassword);
    const user = await User.findOne({ email });
    if (!user || !user.verified) {
      return res.status(400).json({ message: "otp is not verified" });
    }
    const hashPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashPassword;
    user.verified = false;
    await user.save();
    return res.status(200).json({ message: "password reset successfully!" });
  } catch (error) {
    res
      .status(500)
      .json({ message: `unable to reset password ${error.message}` });
  }
};

const signupwithgoogle = async (req, res) => {
  try {
    const { fullName, email, mobileNumber, role } = req.body;
    let user = await User.findOne({ email });

    if (user) {
      return res.status(409).json({ message: "User already exists" });
    }

    user = await User.create({
      fullName,
      email,
      mobile: mobileNumber,
      role,
    });

    const token = await generateToken(user._id);
    res.cookie("token", token, {
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });
    return res.status(201).json(user);
  } catch (err) {
    return res
      .status(500)
      .json({ message: `unable to sign up ${err.message}` });
      console.log(err.message);
  }
};
const signinwithgoogle = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "user does not exits" });
    }

    const token = await generateToken(user._id);
    res.cookie("token", token, {
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });
    return res.status(200).json(user);
  } catch (err) {
    return res
      .status(500)
      .json({ message: `unable to sign in using google ${err.message}` });
  }
};

module.exports = {
  signup,
  signout,
  signin,
  sendotp,
  verifyotp,
  resetpassword,
  signupwithgoogle,
  signinwithgoogle
};
