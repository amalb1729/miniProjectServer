const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    itemId: { type: mongoose.Schema.Types.ObjectId, ref: "Item", required: true },
    quantity: { type: Number, required: true, min: 1 },
    status: { type: String, enum: ["Pending", "Completed", "Cancelled"], default: "Pending" },
    orderedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Order", OrderSchema);
