const express = require("express");
const mongoose=require("mongoose");
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

        const itemName=item.name
        const itemPrice=item.price
        const itemQuantity=quantity

        console.log(itemId,itemName,itemPrice,itemQuantity)

        if (item.stock < quantity) {
            return res.status(400).json({ message: "Insufficient stock" });
        }

        // ✅ Check if an order already exists for this user and item
        let existingOrder = await Order.findOne({ userId,status:"Pending"}).sort({ _id: -1 });//trying find to order matching userid and status as pending
        //by putting sort({_id:-1}) it searches from last inserted document, putting 1 will search from first inserted document

        if (existingOrder) {
            // ✅ Update existing order quantity
            let order=existingOrder.orderedItems.find((element)=>element.itemId==itemId);
            if(order){
                    existingOrder.orderedItems.forEach(element => {
                        if(element.itemId==itemId){
                            if(element.itemPrice==itemPrice)
                                element.itemQuantity+=quantity;
                            else
                                existingOrder.orderedItems.push({itemId,itemName,itemPrice,itemQuantity})

                        }
                    });
                    existingOrder.save();
            }
            else{
                console.log("not found")
                existingOrder.orderedItems.push({itemId,itemName,itemPrice,itemQuantity})
                existingOrder.save();
            }
            //await existingOrder.save();
        } else {
            // ✅ Create a new order if none exists
            console.log("no order found")
            let orderedItems=[{itemId,itemName,itemPrice,itemQuantity}];
            existingOrder = new Order({ userId,orderedItems });
            await existingOrder.save();
        }

        // ✅ Update stock after confirming order placement
        item.stock -= quantity;
        await item.save();

        res.status(201).json({ message: "Order placed successfully", order: existingOrder });
    } catch (error) {
        console.log("error")
        res.status(500).json({ message: "Error placing order",error });
    }
});


// Fetch all orders for admin
router.get("/orders", async (req, res) => {
    try {
        const pendingOrders=await Order.find({status:"Pending"}).populate({path:"userId",select:["username"]})
        const completedOrders=await Order.find({status:{ $in: ["Completed", "Cancelled"] }}).populate({path:"userId",select:["username"]});
        const order={pendingOrders,completedOrders}
        res.json(order);

    } catch (error) {
        res.status(500).json({ message: "Error fetching orders" });
        console.log(error)
    }
});

router.get("/orders/:id", async (req, res) => {
    const {id}=req.params
    const userId=new mongoose.Types.ObjectId(id)
    try {
        const pendingOrders=await Order.find({ userId,status:"Pending"});
        console.log(pendingOrders)
        const completedOrders=await Order.find({ userId,status:{ $in: ["Completed", "Cancelled"] }});
        console.log(completedOrders)
        const order={pendingOrders,completedOrders}
        res.json(order);

    } catch (error) {
        res.status(500).json({ message: "Error fetching orders" });
        console.log(error)
    }
});

router.put("/orders/change",async (req,res)=>{

    const {id,status}=req.body;
    console.log("hi")
    try {
        const order=await Order.findByIdAndUpdate(id,{status});

        console.log("qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq")
        const neworder=await Order.findById(id);
        console.log(neworder)

        res.json(order);
    } catch (error) {
        res.status(500).json({ message: "Error fetching orders" });
        console.log(error)
    }


})

module.exports = router;
