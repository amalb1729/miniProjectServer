const express = require("express");

const router = express.Router();

const {getCompletedOrders,toOrder,saveCart,fetchUserCart,getPendingOrders,addToCart,userOrder,changeOrder,cancelAllPendingOrders}=require('../controllers/orderController')


const verifyJWT = require("../middleware/verifyJWT");
const verifyAdmin = require("../middleware/verifyAdmin");
const { verifyCheckoutEnabled, toggleCheckout, getCheckoutStatus } = require("../middleware/checkoutControl");

router.use(verifyJWT);

// Place an order - now requires checkout to be enabled
router.post("/toOrder/:id", verifyCheckoutEnabled, toOrder);
router.post("/toCart",addToCart);

router.post("/saveCart/:id",saveCart);

// Fetch all orders for admin - requires admin role
router.get("/pendingOrders", verifyAdmin, getPendingOrders);
router.get("/completedOrders", verifyAdmin, getCompletedOrders);

//fetch ordder of userid
router.get("/orders/:id", userOrder);
router.get("/cart/:id",fetchUserCart)

//for changing status - requires admin role
router.put("/orders/change", verifyAdmin, changeOrder)

// Cancel all pending orders - admin only
router.post("/cancel-all-pending", verifyAdmin, cancelAllPendingOrders);


router.get("/checkout-status", (req, res) => {
    res.json({ checkoutEnabled: getCheckoutStatus() });
});

router.post("/toggle-checkout", verifyAdmin, (req, res) => {
    const newStatus = toggleCheckout();
    res.json({ 
        checkoutEnabled: newStatus,
        message: newStatus ? "Checkout has been enabled" : "Checkout has been disabled"
    });
});

module.exports = router;
