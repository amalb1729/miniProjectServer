const express = require("express");

const router = express.Router();

const {allOrders,addOrder,userOrder,changeOrder}=require('../controllers/orderController')

// Place an order
router.post("/order",addOrder);

// Fetch all orders for admin
router.get("/orders",allOrders );

router.get("/orders/:id", userOrder);

router.put("/orders/change",changeOrder)

module.exports = router;
