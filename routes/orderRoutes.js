const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const Item = require("../models/item");

// Place an order
router.post("/orders", async (req, res) => {
    const { userId, itemId, quantity } = req.body;

    try {
        const item = await Item.findById(itemId);
        if (!item) {
            return res.status(404).json({ message: "Item not found" });
        }

        if (item.stock < quantity) {
            return res.status(400).json({ message: "Insufficient stock" });
        }

        // ✅ Check if an order already exists for this user and item
        let existingOrder = await Order.findOne({ userId, itemId });

        if (existingOrder) {
            // ✅ Update existing order quantity
            existingOrder.quantity += quantity;
            await existingOrder.save();
        } else {
            // ✅ Create a new order if none exists
            existingOrder = new Order({ userId, itemId, quantity });
            await existingOrder.save();
        }

        // ✅ Update stock after confirming order placement
        item.stock -= quantity;
        await item.save();

        res.status(201).json({ message: "Order placed successfully", order: existingOrder });
    } catch (error) {
        res.status(500).json({ message: "Error placing order", error });
    }
});


// Fetch all orders for a user
router.get("/orders/:userId", async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.params.userId }).populate("itemId");
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: "Error fetching orders" });
    }
});

module.exports = router;
