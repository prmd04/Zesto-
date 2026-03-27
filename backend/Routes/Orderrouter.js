const express = require("express");
const isAuth = require("../middlewares/isAuth");
const {placeOrder,getMyOrders, updateOrderStatus, deliveryBoyAssignment, acceptOrder,getCurrentOrder, getOrderById, sendDeliveryOtp, verifyDeliveryOtp, verifyPayment}= require("../controllers/orderContoller");



const orderRouter = express.Router();
orderRouter.get('/getassignment',isAuth,deliveryBoyAssignment);
orderRouter.post('/placeorder',isAuth,placeOrder);
orderRouter.post('/verifypayement',isAuth,verifyPayment);
orderRouter.get('/getmyorders',isAuth,getMyOrders);
orderRouter.get("/currentorder",isAuth,getCurrentOrder);
orderRouter.post('/deliveryotp',isAuth,sendDeliveryOtp);
orderRouter.post('/verifydeliveryotp',isAuth,verifyDeliveryOtp);
orderRouter.post('/updatestatus/:orderId/:shopId',isAuth,updateOrderStatus);
orderRouter.get('/acceptorder/:assignmentId',isAuth,acceptOrder);
orderRouter.get("/getorderbyid/:orderId",isAuth,getOrderById);

module.exports = orderRouter;