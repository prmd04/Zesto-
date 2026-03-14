const express = require("express");
const isAuth = require("../middlewares/isAuth");
const {createEditShop,getMyShop,getCurrentShop, getShopByCity} = require("../controllers/shopController");
const upload = require("../middlewares/multer");



const shopRouter = express.Router();

shopRouter.post('/create-edit',isAuth,upload.single("image"),createEditShop);
shopRouter.get("/getmyshop",isAuth,createEditShop,getMyShop);
shopRouter.get('/current',isAuth,getCurrentShop);
shopRouter.get("/getshopbycity/:city",isAuth,getShopByCity);


module.exports = shopRouter;