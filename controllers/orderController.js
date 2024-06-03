const Order = require("../models/orderSchema.js");
const Product = require("../models/productSchema.js");
const ErrorHandler = require("../utils/errorHandler.js");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors.js");

exports.newOrder = catchAsyncErrors(async (req, res, next) => {
  console.log(req.body);

  const { shippingInfo, paymentInfo, itemsPrice, taxPrice, shippingPrice, totalPrice, orderItems } = req.body;

  



  try {
    
    

    const order = await Order.create({
      shippingInfo,
      orderItems, 
      paymentInfo,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      paidAt: Date.now(),
      user: req.user._id,
    });

    res.status(201).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error('Error creating new order:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});



// GET SINGLE ORDER
exports.getSingleOrder = catchAsyncErrors(async (req, res, next) => {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "name email"
    );
  
    if (!order) {
      return next(new ErrorHandler("Order not found with this Id", 404));
    }
  
    res.status(200).json({
      success: true,
      order,
    });
  });

  // GET All Orders
  exports.getAllOrders = catchAsyncErrors(async (req, res, next) => {
    
    const orders = await Order.find().populate('user', 'name email');
  
    res.status(200).json({
      success: true,
      orders,
    });
  });

  // GET LOGGED IN CUSTOMER  ORDERS
  exports.myOrders = catchAsyncErrors(async (req, res, next) => {
    if (!req.user || !req.user._id) {
      console.log("User ID not found in request");
      return next(new ErrorHandler("User ID not found in request", 400));
    }
  
    console.log("Fetching orders for user", req.user._id);
  
    try {
      const orders = await Order.find({ user: "6640bce75e5847071fdfb6f1"});
  
      if (!orders || orders.length === 0) {
        console.log("No orders found for user", req.user._id);
        return next(new ErrorHandler("No orders found", 404));
      }
  
      
      res.status(200).json({
        success: true,
        orders,
      });
    } catch (error) {
      console.log("Error fetching orders", error);
      return next(new ErrorHandler("Error fetching orders", 500));
    }
  });
  
// UPDATE ORDER STATUS -- ADMIN
exports.updateOrder = catchAsyncErrors(async (req, res, next) => {
    const order = await Order.findById(req.params.id);
  
    if (!order) {
      return next(new ErrorHandler("Order not found with this Id", 404));
    }
  
    if (order.orderStatus === "Delivered") {
      return next(new ErrorHandler("You have already delivered this order", 400));
    }
  
    if (req.body.status === "Shipped") {
      order.orderItems.forEach(async (o) => {
        await updateStock(o.product, o.quantity);
      });
    }
    order.orderStatus = req.body.status;
  
    if (req.body.status === "Delivered") {
      order.deliveredAt = Date.now();
    }
  
    await order.save({ validateBeforeSave: false });
    res.status(200).json({
      success: true,
    });
  });
  
  async function updateStock(id, quantity) {
    const product = await Product.findById(id);
  
    product.Stock -= quantity;
  
    await product.save({ validateBeforeSave: false });
  }
  
  

  
// DELETE ORDER -- ADMIN
exports.deleteOrder = catchAsyncErrors(async (req, res, next) => {
    const order = await Order.findById(req.params.id);
  
    if (!order) {
      return next(new ErrorHandler("Order not found with this Id", 404));
    }
  
    await order.deleteOne();
  
    res.status(200).json({
      success: true,
    });
  });
  
  