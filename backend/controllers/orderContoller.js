const dotenv = require("dotenv");
dotenv.config();
const Shop = require("../models/shopModel");
const Order = require("../models/orderModel");
const User = require("../models/userModel");
const deliveryAssignment = require("../models/deliveryAssignmentModel");
const Razorpay = require("razorpay");

var instance = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY,
  key_secret: process.env.RAZORPAY_API_SECRET,
});

const placeOrder = async (req, res) => {
  try {
    const { cartItems, paymentMethod, deliveryAddress, totalAmount } = req.body;

    // 1️⃣ Basic Validation
    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    if (
      !deliveryAddress?.text ||
      deliveryAddress.latitude == null ||
      deliveryAddress.longitude == null
    ) {
      return res
        .status(400)
        .json({ message: "Delivery address is incomplete" });
    }

    // 2️⃣ Group Items by Shop
    const groupedByShop = {};

    for (const item of cartItems) {
      const shopId = item.shop?._id;
      const ownerId = item.shop?.owner;

      if (!shopId || !ownerId) {
        return res.status(400).json({ message: "Invalid shop data in cart" });
      }

      if (!groupedByShop[shopId]) {
        groupedByShop[shopId] = {
          owner: ownerId,
          items: [],
        };
      }

      groupedByShop[shopId].items.push(item);
    }

    // 3️⃣ Build shopOrders array
    const shopOrders = [];

    for (const shopId of Object.keys(groupedByShop)) {
      const group = groupedByShop[shopId];

      const subTotal = group.items.reduce(
        (sum, i) => sum + i.price * i.quantity,
        0,
      );

      shopOrders.push({
        shop: shopId,
        owner: group.owner,
        subTotal,
        shopItems: group.items.map((i) => ({
          item: i.id,
          price: i.price,
          quantity: i.quantity,
          name: i.name,
        })),
      });
    }

    //create order when payment method is online.
    if (paymentMethod === "online") {
      const razorpayOrder = await instance.orders.create({
        amount: Math.round(totalAmount * 100),
        currency: "INR",
        receipt: "receipt" + Date.now(),
      });

      const newOrder = await Order.create({
        user: req.userId,
        deliveryAddress,
        paymentMethod,
        totalAmount,
        shopOrders,
        razorpayOrderId: razorpayOrder.id,
        payment: false,
      });
      return res.status(201).json({
        razorpayOrder,
        orderId: newOrder._id,
      });
    }

    // 4️⃣ Create Order
    const newOrder = await Order.create({
      user: req.userId,
      deliveryAddress,
      paymentMethod,
      totalAmount,
      shopOrders,
    });

    // 5️⃣ Populate for Response
    await Order.populate(newOrder, [
      { path: "shopOrders.owner", select: "fullName socketId" },
      { path: "shopOrders.shop", select: "name" },
      { path: "user", select: "fullName mobile email" },
    ]);

    return res.status(201).json(newOrder);
  } catch (error) {
    console.error("Place Order Error:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

const verifyPayement = async (req, res) => {
  try {
    const { razorpay_payment_id, orderId } = req.body;

    const payment = await instance.payments.fetch(razorpay_payment_id);

    if (!payment || payment.status != "captured") {
      return res.status(400).json({ message: "invalid payment" });
    }
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "order not found" });
    }
    order.payment = true;
    order.razorpayPaymentId = razorpay_payment_id;
    await order.save();

    await Order.populate(order, [
      { path: "shopOrders.owner", select: "fullName socketId" },
      { path: "shopOrders.shop", select: "name" },
      { path: "user", select: "fullName mobile email" },
    ]);
    return res.status(200).json({
      message: "Payment verified successfully",
      order,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (user.role == "user") {
      const orders = await Order.find({ user: req.userId })
        .sort({ createdAt: -1 })
        .populate("shopOrders.shop", "name")
        .populate("shopOrders.owner", "name email mobile")
        .populate("shopOrders.shopItems.item", "name image price");

      return res.status(200).json(orders);
    } else if (user.role == "owner") {
      const orders = await Order.find({ "shopOrders.owner": req.userId })
        .sort({ createdAt: -1 })
        .populate("shopOrders.shop", "name")
        .populate("user")
        .populate("shopOrders.shopItems.item", "name image price")
        .populate("shopOrders.assignedTo", "fullName mobile");
      return res.status(200).json(orders);
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: `get user error ${error}` });
  }
};

const updateOrderStatus = async (req, res) => {
  
  try {
    const { orderId, shopId } = req.params;
    const { status } = req.body;
   

    // Fetch parent order
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    //  Find shop-specific order
    const shopOrder = order.shopOrders.find(
      (o) => o.shop.toString() === shopId,
    );
    if (!shopOrder) {
      return res.status(400).json({ message: "Shop order not found" });
    }

    //  Update shop order status
    shopOrder.status = status;

    let deliveryBoysPayload = [];

    // Create delivery assignment ONLY when needed
    if (status === "out for delivery" && !shopOrder.assignment) {
      const { longitude, latitude } = order.deliveryAddress;


      // Find nearby delivery boys
      const nearbyDeliveryBoys = await User.find({
        role: "deliveryBoy",
        location: {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: [Number(longitude), Number(latitude)],
            },
            $maxDistance: 5000,
          },
        },
      });

      if (nearbyDeliveryBoys.length === 0) {
        return res.json({
          message: "Order updated but no delivery boys nearby",
        });
      }

      //  Find busy delivery boys
      const nearbyIds = nearbyDeliveryBoys.map((boy) => boy._id);

      const busyIds = await deliveryAssignment
        .find({
          assignedTo: { $in: nearbyIds },
          status: { $in: ["assigned"] },
        })
        .distinct("assignedTo");
        

      const busyIdSet = new Set(busyIds.map((id) => id.toString()));

      //  Filter available delivery boys
      const availableBoys = nearbyDeliveryBoys.filter(
        (boy) => !busyIdSet.has(boy._id.toString()),
      );

      if (availableBoys.length === 0) {
        return res.json({
          message: "Order updated but all delivery boys are busy",
        });
      }

      //  Create delivery assignment (broadcast stage)
      const assignmentDoc = await deliveryAssignment.create({
        order: order._id,
        shop: shopOrder.shop,
        shopOrderId: shopOrder._id,
        broadcastedTo: availableBoys.map((boy) => boy._id),
        status: "broadcasted",
      });
      
      //  Attach assignment to shopOrder
      shopOrder.assignment = assignmentDoc._id;
      shopOrder.assignedTo = null;

      // 4Prepare response payload
      deliveryBoysPayload = availableBoys.map((boy) => ({
        id: boy._id,
        name: boy.fullName,
        longitude: boy.location.coordinates[0],
        latitude: boy.location.coordinates[1],
        mobile: boy.mobile,
      }));
    }

    //  Save parent document
    await order.save();

    const updatedShopOrder = order.shopOrders.find((o) => o.shop == shopId);

    // Populate for response
    await order.populate("shopOrders.shop", "name");
    await order.populate("shopOrders.assignment");

    return res.status(200).json({
      shopOrder: updatedShopOrder,
      availableBoys: deliveryBoysPayload,
      assignment: updatedShopOrder.assignment,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};
const deliveryBoyAssignment = async (req, res) => {
  try {
    const deliveryBoyId = req.userId;

    const assignments = await deliveryAssignment
      .find({
        broadcastedTo: deliveryBoyId,
        status: "broadcasted",
      })
      .populate("order")
      .populate("shop");

    const formatted = assignments
      .filter((ass) => ass.order) // safety
      .map((ass) => {
        const shopOrder = ass.order.shopOrders.find(
          (so) => so._id.toString() === ass.shopOrderId.toString(),
        );

        if (!shopOrder) return null;

        return {
          assignmentId: ass._id,
          orderId: ass.order._id,
          shopId: ass.shop._id,
          shopName: ass.shop.name,
          deliveryAddress: ass.order.deliveryAddress,
          items: shopOrder.shopItems,
          subTotal: shopOrder.subTotal,
        };
      });

    return res.status(200).json(formatted);
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

const acceptOrder = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const assignment = await deliveryAssignment.findById(assignmentId);

    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    //if someone picked that assginment before the other then status changed
    if (assignment.status !== "broadcasted") {
      return res.status(404).json({ message: "Assignment is expire" });
    }

    const alredyAssigned = await deliveryAssignment.findOne({
      assignedTo: req.userId,
      status: { $nin: ["broadcasted", "completed"] },
    });

    if (alredyAssigned) {
      return res
        .status(404)
        .json({ message: "complete the previous assignment first" });
    }
    assignment.assignedTo = req.userId;
    assignment.status = "assigned";
    assignment.acceptedAt = new Date();
    await assignment.save();

    const order = await Order.findById(assignment.order);
    const shopOrder = order.shopOrders.find(
      (so) => so._id.toString() === assignment.shopOrderId.toString(),
    );

    shopOrder.assignedTo = req.userId;
    await order.save();

    return res.status(200).json({ message: "Assignment accepted" });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

const getCurrentOrder = async (req, res) => {
  try {
    const assignment = await deliveryAssignment
      .findOne({
        assignedTo: req.userId,
        status: "assigned",
      })
      .populate({
        path: "order",
        populate: [
          {
            path: "user",
            select: "fullName mobile email",
          },
          {
            path: "shopOrders.shop",
            select: "name",
          },
        ],
      })
      .populate("shop", "name")
      .populate("assignedTo", "fullName mobile location");

    if (!assignment) {
      return res.status(200).json(null);
    }

    if (!assignment.order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const shopOrder = assignment.order.shopOrders.find(
      (so) => so._id.toString() === assignment.shopOrderId.toString(),
    );

    if (!shopOrder) {
      return res.status(404).json({ message: "Shop order not found" });
    }

    let deliveryBoyLocation = { lat: null, lon: null };
    if (assignment.assignedTo?.location?.coordinates?.length === 2) {
      deliveryBoyLocation.lat = assignment.assignedTo.location.coordinates[1];
      deliveryBoyLocation.lon = assignment.assignedTo.location.coordinates[0];
    }

    let customerLocation = { lat: null, lon: null };
    if (assignment.order.deliveryAddress) {
      customerLocation.lat = assignment.order.deliveryAddress.latitude;
      customerLocation.lon = assignment.order.deliveryAddress.longitude;
    }

    return res.status(200).json({
      _id: assignment.order._id,
      assignmentId: assignment._id,
      user: assignment.order.user,
      shopOrder,
      deliveryAddress: assignment.order.deliveryAddress,
      deliveryBoyLocation,
      customerLocation,
    });
  } catch (error) {
    return res.status(500).json({
      message: `Get current order error: ${error.message}`,
    });
  }
};

const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId)
      .populate("user")
      .populate({
        path: "shopOrders.shop",
        model: "Shop",
      })
      .populate({
        path: "shopOrders.assignedTo",
        model: "User",
      })
      .populate({
        path: "shopOrders.shopItems.item",
        model: "Item",
      });

    if (!order) {
      return res.status(404).json({ message: "order not found" });
    }

    return res.status(200).json(order);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: `Get order by id error: ${error.message}`,
    });
  }
};

const sendDeliveryOtp = async (req, res) => {
  try {
    const { orderId, shopOrderId } = req.body;

    const order = await Order.findById(orderId).populate(
      "user",
      "fullName email"
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const shopOrder = order.shopOrders.id(shopOrderId);

    if (!shopOrder) {
      return res.status(404).json({ message: "Shop order not found" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);

    shopOrder.deliveryOtp = otp;
    shopOrder.otpExpires = Date.now() + 10 * 60 * 1000;

    await order.save();

    // console.log("Delivery OTP:", otp);

    return res.status(200).json({
      success: true,
      message: "OTP generated successfully",
      otp: otp
    });

  } catch (error) {
    return res.status(500).json({
      message: `Send delivery otp error: ${error.message}`,
    });
  }
};
const verifyDeliveryOtp = async (req, res) => {
  try {
    const { orderId, shopOrderId, otp } = req.body;
    const order = await Order.findById(orderId).populate("user");
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const shopOrder = order.shopOrders.id(shopOrderId);
    if (!shopOrder) {
      return res.status(404).json({ message: "Shop order not found" });
    }

    if (!shopOrder.deliveryOtp) {
      return res.status(400).json({ message: "No OTP found" });
    }

    if (shopOrder.otpExpires < Date.now()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    if (shopOrder.deliveryOtp !== otp) {
      return res.status(400).json({ message: " Invalid OTP" });
    }

    shopOrder.status = "delivered";
    shopOrder.deliveredAt = new Date();
    shopOrder.deliveryOtp = null;
    shopOrder.otpExpires = null;

    await order.save();

    await deliveryAssignment.deleteOne({
      order: order._id,
      shopOrderId: shopOrder._id,
    });

    return res.status(200).json({
      message: "Order delivered successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: `delivery otp error: ${error.message}`,
    });
  }
};

module.exports = {
  placeOrder,
  getMyOrders,
  updateOrderStatus,
  deliveryBoyAssignment,
  acceptOrder,
  getCurrentOrder,
  getOrderById,
  sendDeliveryOtp,
  verifyDeliveryOtp,
  verifyPayement,
};
