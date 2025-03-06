const express = require("express");
const router = express.Router();
const {Order} = require("../models/Order");
const Item = require("../models/item");
const User =require("../models/user")

// Place an order
router.post("/order", async (req, res) => {
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
        let existingOrder = await Order.findOne({ userId});

        if (existingOrder) {
            // ✅ Update existing order quantity
            let order=existingOrder.orderedItems.find((element)=>element.itemId==itemId);
            if(order){
                    existingOrder.orderedItems.forEach(element => {
                        if(element.itemId==itemId){
                            element.quantity+=quantity;
                        }
                    });
                    existingOrder.save();
            }
            else{
                console.log("not found")
                existingOrder.orderedItems.push({itemId, quantity})
                existingOrder.save();
            }
            //await existingOrder.save();
        } else {
            // ✅ Create a new order if none exists
            console.log("no order found")
            let orderedItems=[{itemId, quantity}];
            existingOrder = new Order({ userId,orderedItems });
            await existingOrder.save();
        }

        // ✅ Update stock after confirming order placement
        item.stock -= quantity;
        await item.save();

        res.status(201).json({ message: "Order placed successfully", order: existingOrder });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Error placing order", error });
    }
});


// Fetch all orders for a user
router.get("/orders", async (req, res) => {
    try {
        const orders = await Order.find().populate({path:"userId",select:["username"]}).populate({path:"orderedItems.itemId",select:["name","price"]});
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: "Error fetching orders" });
        console.log(error)
    }
});

module.exports = router;
