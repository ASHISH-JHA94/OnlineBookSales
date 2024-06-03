const ErrorHandler = require("../utils/errorHandler.js");
const catchAsyncErrors = require("./catchAsyncErrors");
const jwt = require("jsonwebtoken");
const Customer = require("../models/customerSchema.js");



exports.isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    console.log("No token provided");
    return next(new ErrorHandler("Please Login to access this resource", 401));
  }

  try {
    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await Customer.findById(decodedData.id);

    if (!req.user) {
      console.log("User not found");
      return next(new ErrorHandler("User not found", 404));
    }

    console.log("User authenticated", req.user);
    next();
  } catch (error) {
    console.log("Error verifying token", error);
    return next(new ErrorHandler("Invalid token", 401));
  }
});


exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          `Role: ${req.user.role} is not allowed to access this resouce `,
          403
        )
      );
    }

    next();
  };
};
