const express = require("express");

const router = express.Router();

const {getCompletedOrders,toOrder,saveCart,fetchUserCart,getPendingOrders,addToCart,userOrder,changeOrder}=require('../controllers/orderController')


const verifyJWT = require("../middleware/verifyJWT");

router.use(verifyJWT);

// Place an order
router.post("/toOrder/:id",toOrder);
router.post("/toCart",addToCart);

router.post("/saveCart/:id",saveCart);

// Fetch all orders for admin
router.get("/pendingOrders",getPendingOrders );
router.get("/completedOrders",getCompletedOrders );

//fetch ordder of userid
router.get("/orders/:id", userOrder);
router.get("/cart/:id",fetchUserCart)

//for changing status
router.put("/orders/change",changeOrder)

module.exports = router;
