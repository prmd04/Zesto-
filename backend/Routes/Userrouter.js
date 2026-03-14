const express = require("express");
const {getCurrentUser,updateUserLocation} = require("../controllers/userController");
const isAuth = require("../middlewares/isAuth");


const userRouter = express.Router();

userRouter.get('/current',isAuth,getCurrentUser);
userRouter.post('/updateuserlocation',isAuth,updateUserLocation);

module.exports = userRouter;