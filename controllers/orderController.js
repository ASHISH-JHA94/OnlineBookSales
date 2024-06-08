const Order = require("../models/orderSchema.js");
const Product = require("../models/productSchema.js");
const ErrorHandler = require("../utils/errorHandler.js");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors.js");
require('dotenv').config();
const Customer=require("../models/customerSchema.js")
const axios=require("axios");


const getLatLngFromAddress = async (address) => {
  const { GEOAPIFY_API_KEY } = process.env;
  const url = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(address)}&apiKey=${GEOAPIFY_API_KEY}`;

  try {
    const response = await axios.get(url);
    const { lat, lon } = response.data.features[0].properties;
    console.log(lat);
    console.log("hii");
    console.log(lon);
    return { latitude: lat, longitude: lon };
  } catch (error) {
    console.error('Error getting latitude and longitude:', error);
    throw new Error('Failed to get latitude and longitude');
  }
};

const calculateDistance = (origin, destination) => {
  const toRadians = (degrees) => {
    return degrees * (Math.PI / 180);
  };

  const earthRadiusKm = 6371;

  const { latitude: lat1, longitude: lon1 } = origin;
  const { latitude: lat2, longitude: lon2 } = destination;

  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distanceInKm = earthRadiusKm * c;

  return distanceInKm;
};


exports.newOrder = catchAsyncErrors(async (req, res, next) => {
  console.log(req.body);

  const { shippingInfo, paymentInfo, itemsPrice, taxPrice, orderItems } = req.body;

  try {
    // Get latitude and longitude for the customer's address
    const customerAddress = `${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.state}, ${shippingInfo.country}`;
    const customerLatLng = await getLatLngFromAddress(customerAddress);

    // Get latitude and longitude for each product's address
    const productIds = orderItems.map(item => item.product);
    const products = await Product.find({ _id: { $in: productIds } }).populate('user');
    const productLatLngs = await Promise.all(products.map(async (product) => {
      const productAddress = `${product.user.address}, ${product.user.city}, ${product.user.state}, ${product.user.country}`;
      
      return getLatLngFromAddress(productAddress);
    }));

    // Calculate total shipping cost
    let totalShippingCost = 0;
    for (const latLng of productLatLngs) {
      const shippingCost = await calculateDistance(customerLatLng, latLng);
      totalShippingCost += shippingCost;
    }

    const totalPrice = itemsPrice + taxPrice + totalShippingCost;

    // Create the shipping location objects
    const sourceLocation = {
      latitude: customerLatLng.latitude,
      longitude: customerLatLng.longitude
    };
    const destinationLocation = {
      latitude: productLatLngs[0].latitude,
      longitude: productLatLngs[0].longitude
    };

    const order = await Order.create({
      shippingInfo: {
        ...shippingInfo,
        source: sourceLocation,
        destination: destinationLocation
      },
      orderItems,
      paymentInfo,
      itemsPrice,
      taxPrice,
      shippingPrice: totalShippingCost,
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
      const orders = await Order.find({ user:req.user._id });
  
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
  
  