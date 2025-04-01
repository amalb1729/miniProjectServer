const express = require("express");

const router = express.Router();

const {getCompletedOrders,getPendingOrders,addOrder,userOrder,changeOrder}=require('../controllers/orderController')

// Place an order
router.post("/order",addOrder);

// Fetch all orders for admin
router.get("/pendingOrders",getPendingOrders );
router.get("/completedOrders",getCompletedOrders );

router.get("/orders/:id", userOrder);

router.put("/orders/change",changeOrder)

module.exports = router;
