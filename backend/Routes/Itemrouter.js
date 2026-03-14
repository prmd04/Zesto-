const express = require("express");
const isAuth = require("../middlewares/isAuth");
const upload = require("../middlewares/multer");
const { addItem, editItem, getItemById, deleteItem, getItemByCity, getItemByShop, searchItems } = require("../controllers/itemController");


const itemRouter = express.Router();

itemRouter.post('/additem',isAuth,upload.single("image"),addItem);
itemRouter.post('/edititem/:id',isAuth,upload.single("image"),editItem)
itemRouter.get("/getitembyid/:itemId",isAuth,getItemById);
itemRouter.get("/getitembycity/:city",isAuth,getItemByCity);
itemRouter.get("/deleteitem/:itemId",isAuth,deleteItem);
itemRouter.get("/getitembyshop/:shopId",isAuth,getItemByShop);
itemRouter.get("/searchitems",isAuth,searchItems);


module.exports = itemRouter;