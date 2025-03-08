const mongoose = require("mongoose");

const orderedItemsSchema=new mongoose.Schema({
    itemId:{ type: mongoose.Schema.Types.ObjectId, ref: "Item", required: true },
    itemName:{ type: String, required: true },
    itemPrice: { type: Number, required: true, min: 1 },
    itemQuantity: { type: Number, required: true, min: 1 }
})

const OrderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    orderedItems:[orderedItemsSchema],
    status: { type: String, enum: ["Pending", "Completed", "Cancelled"], default: "Pending" },
    orderedAt: { type: Date, default: Date.now }
});


Order = mongoose.model("Order", OrderSchema)
module.exports = {Order};

