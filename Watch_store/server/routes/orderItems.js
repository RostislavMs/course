//server/routes/orderItems.js
const express = require("express");
const {
  getAllOrderItems,
  createOrderItem,
  updateOrderItem,
  deleteOrderItem,
} = require("../controllers/orderItemsController");

const router = express.Router();

router.get("/", getAllOrderItems);
router.post("/", createOrderItem);
router.put("/:id", updateOrderItem);
router.delete("/:id", deleteOrderItem);

module.exports = router;
