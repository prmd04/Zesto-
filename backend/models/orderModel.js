const mongoose = require("mongoose");

const shopItemSchema = new mongoose.Schema(
  {
    item: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
      required: true,
    },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, default: 1 },
    name: String,
  },
  { timestamps: true },
);

const shopSchema = new mongoose.Schema(
  {
    shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    subTotal: {
      type: Number,
      default: 0,
    },
    shopItems: [shopItemSchema],
    status: {
      type: String,
      enum: ["pending", "preparing", "out for delivery", "delivered"],
      default: "pending",
    },
    assignment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DeliveryAssignment",
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    deliveryOtp:{
      type:String,
      default:null
    },
    otpExpires:{
      type:Date,
      default:null  
    },
    deliveredAt:{
      type:Date,
      default:null
    }
  },
  { timestamps: true },
);

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ["cod", "online"],
      required: true,
    },
    deliveryAddress: {
      text: { type: String, required: true },
      latitude: Number,
      longitude: Number,
    },
    totalAmount: {
      type: Number,
      required: true,
      default: 0,
    },
    shopOrders: [shopSchema],
    payment:{
      type:Boolean,
      default:false
    },
    razorpayOrderId:{
      type:String,
      default:null
    },
    razorpayPaymentId:{
      type:String,
      default:null
    },
  },
  { timestamps: true },
);

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
