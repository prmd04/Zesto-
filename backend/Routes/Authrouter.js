const express = require("express");

const {
  signup,
  signin,
  signout,
  sendotp,
  verifyotp,
  resetpassword,
  signupwithgoogle,
  singinwithgoogle,
} = require("../controllers/auth");

const authRouter = express.Router();

authRouter.post("/signup", signup);
authRouter.post("/signin", signin);
authRouter.get("/signout", signout);
authRouter.post("/sendotp", sendotp);
authRouter.post("/verifyotp", verifyotp);
authRouter.post("/resetpassword", resetpassword);
authRouter.post("/signupwithgoogle", signupwithgoogle);
authRouter.post("/singinwithgoogle", singinwithgoogle);


module.exports = authRouter;
