const {Order} = require("../models/Order");
const Item = require("../models/item");
const User =require("../models/user");
const {Cart} =require("../models/cart");

const mongoose=require("mongoose");


const getPendingOrders=async (req, res) => {
    try {
        const pendingOrders=await Order.find({status:"Pending"}).sort({ _id: -1 }).populate({path:"userId",select:["username","department","semester"]});
        res.json(pendingOrders);

    } catch (error) {
        res.status(500).json({ message: "Error fetching orders" });
        console.log(error)
    }
}
const getCompletedOrders=async (req, res) => {
    try {
        const completedOrders=await Order.find({status:{ $in: ["Completed", "Cancelled"] }}).sort({ _id: -1 }).populate({path:"userId",select:["username","department","semester"]});
        res.json(completedOrders);

    } catch (error) {
        res.status(500).json({ message: "Error fetching orders" });
        console.log(error)
    }
}


const addToCart= async (req, res) => {
    const { userId, itemId, quantity } = req.body;
    try {
        const item = await Item.findById(itemId);
        if (!item) {
            return res.status(404).json({ message: "Item not found" });
        }

        const itemName=item.name
        const itemPrice=item.price
        const itemQuantity=quantity

        // ✅ Check if an order already exists for this user and item
        let existingCart = await Cart.findOne({ userId})

        if (existingCart) {
            // ✅ Update existing order quantity
            let cart=existingCart.userCart.find((element)=>element.itemId==itemId);
            if(cart){
                    existingCart.userCart.forEach(element => {
                        if(element.itemId==itemId){
                            if(element.itemPrice==itemPrice)
                                element.itemQuantity+=quantity;
                            else
                                existingCart.userCart.push({itemId,itemName,itemPrice,itemQuantity})

                        }
                    });
                    existingCart.save();
            }
            else{
                existingCart.userCart.push({itemId,itemName,itemPrice,itemQuantity})
                existingCart.save();
            }
            //await existingCart.save();
        } else {
            // ✅ Create a new order if none exists
            let userCart=[{itemId,itemName,itemPrice,itemQuantity}];
            existingCart = new Cart({ userId,userCart });
            await existingCart.save();
        }

        res.status(201).json({ message: "item added to cart successfully", order: existingCart });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Error adding item",error });
    }
}

const toOrder = async (req, res) => {
    const { id } = req.params; // Cart ID
    console.log("Processing order for cart:", id);

    let successfullyOrderedItems = [];
    let partiallyAvailableItems = [];
    let outOfStockItems = [];
    let notFoundItems = [];

    try {
        const cart = await Cart.findById(id);
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        for (const element of cart.userCart) {
            const item = await Item.findOne({ _id: element.itemId });

            if (!item) {
                notFoundItems.push(element.itemName);
                console.log(`🔍 Item "${element.itemName}" not found in inventory.`);
                continue;
            }

            if (item.stock >= element.itemQuantity) {
                // ✅ Fully available: Reduce stock, remove from cart, and add to order
                await Item.updateOne(
                    { _id: element.itemId },
                    { $inc: { stock: -element.itemQuantity } }
                );

                await Cart.updateOne(
                    { _id: id },
                    { $pull: { userCart: { itemId: element.itemId } } }
                );

                successfullyOrderedItems.push({
                    itemId: item._id,
                    itemName: item.name,
                    itemPrice: item.price,
                    itemQuantity: element.itemQuantity
                });

                console.log(`✅ Item "${item.name}" fully processed and removed from cart.`);

            } else if (item.stock > 0) {
                // ⚠️ Partially available: Adjust quantity in cart and add available quantity to order
                const updatedQuantity = item.stock;

                await Item.updateOne(
                    { _id: element.itemId },
                    { $set: { stock: 0 } }
                );

                await Cart.updateOne(
                    { _id: id, "userCart.itemId": element.itemId },
                    { $set: { "userCart.$.itemQuantity": updatedQuantity } }
                );

                successfullyOrderedItems.push({
                    itemId: item._id,
                    itemName: item.name,
                    itemPrice: item.price,
                    itemQuantity: updatedQuantity
                });

                partiallyAvailableItems.push({ itemName: element.itemName, newQuantity: updatedQuantity });
                console.log(`⚠️ Item "${item.name}" updated to available quantity: ${updatedQuantity}`);

            } else {
                // ❌ Out of stock: Leave item unchanged
                outOfStockItems.push(element.itemName);
                console.log(`❌ Item "${item.name}" is out of stock and remains in cart.`);
            }
        }

        // If some items were successfully ordered, create an order
        let orderCreated = null;
        if (successfullyOrderedItems.length > 0) {
            orderCreated = await Order.create({
                userId: cart.userId,
                orderedItems: successfullyOrderedItems,
                status: "Pending",
            });
            console.log("🛒 Order created with pending status:", orderCreated._id);
        }

        // Fetch updated cart
        const updatedCart = await Cart.findById(id);

        // Check for any failures
        if (partiallyAvailableItems.length > 0 || outOfStockItems.length > 0 || notFoundItems.length > 0) {
            let failureMessage = "Some items could not be fully processed. ";
            if (partiallyAvailableItems.length > 0) {
                failureMessage += `⚠️ Partial stock available: `;
                partiallyAvailableItems.forEach(item => {
                    failureMessage += `${item.itemName} (updated to ${item.newQuantity}), `;
                });
                failureMessage = failureMessage.slice(0, -2) + ". ";
            }
            if (outOfStockItems.length > 0) failureMessage += `❌ Out of stock: ${outOfStockItems.join(", ")}. `;
            if (notFoundItems.length > 0) failureMessage += `🔍 Not found: ${notFoundItems.join(", ")}. `;

            return res.status(206).json({ message: failureMessage, updatedCart, order: orderCreated });
        }

        // If no failures, return success message
        res.status(201).json({ message: "✅ Order processed successfully!", order: orderCreated });

    } catch (error) {
        console.error("❌ Error placing order:", error);
        res.status(500).json({ message: "Error placing order", error });
    }
};


const userOrder=async (req, res) => {
    try {
    const {id}=req.params
    const userId=new mongoose.Types.ObjectId(id)
    
        const pendingOrders=await Order.find({ userId,status:"Pending"}).sort({ _id: -1 });
        const completedOrders=await Order.find({ userId,status:{ $in: ["Completed", "Cancelled"] }}).sort({ _id: -1 });
        const order={pendingOrders,completedOrders}
        res.json(order);

    } catch (error) {
        res.status(500).json({ message: "Error fetching orders" });
        console.log(error)
    }
}

const fetchUserCart=async (req, res) => {
    try {
    const {id}=req.params
    const userId=new mongoose.Types.ObjectId(id)
    
        const cart=await Cart.find({userId})
        res.json(cart);

    } catch (error) {
        res.status(500).json({ message: "Error fetching cart" });
        console.log(error)
    }
}


const saveCart=async (req, res) => {
    try {
    const {id}=req.params
    const {myCart}=req.body;
    const orderId=new mongoose.Types.ObjectId(id)
    const newCart=await Cart.findByIdAndUpdate(orderId,{userCart:myCart});
    res.json({message:"successfull saved cart"})
    } catch (error) {
        res.status(500).json({ message: "Error fetching cart" });
        console.log(error)
    }
}


const changeOrder=async (req,res)=>{

    const {id,status}=req.body;
    try {
        // Get the order before updating to check current status
        const currentOrder = await Order.findById(id);
        
        // If order is being cancelled, restore stock
        if (status === "Cancelled" && currentOrder.status !== "Cancelled") {
            for (const item of currentOrder.orderedItems) {
                await Item.updateOne(
                    { _id: item.itemId },
                    { $inc: { stock: item.itemQuantity } }
                );
            }
        }
        
        const order=await Order.findByIdAndUpdate(id,{status});
        const neworder=await Order.findById(id);
        console.log(neworder)

        res.json(order);
    } catch (error) {
        res.status(500).json({ message: "Error fetching orders" });
        console.log(error)
    }


}
module.exports={saveCart,fetchUserCart,getCompletedOrders,getPendingOrders,addToCart,userOrder,changeOrder,toOrder}