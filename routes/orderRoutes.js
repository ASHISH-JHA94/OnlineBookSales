const express = require("express");
const {
  newOrder,
  getSingleOrder,
  getAllOrders,
  myOrders,
  updateOrder,
  deleteOrder,
  
} = require("../controllers/orderController");
const router = express.Router();

const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth.js");

router.route("/myorders").get(isAuthenticatedUser,myOrders);

router.route("/new").post(isAuthenticatedUser, newOrder);

router.route("/getAll").get(getAllOrders);

router.route("/:id").get(isAuthenticatedUser, getSingleOrder);



router
  .route("/admin/order/:id")
  .put(updateOrder)
  .delete(deleteOrder);

module.exports = router;