const mongoose = require("mongoose");

const cartSchema=new mongoose.Schema({
    itemId:{ type: mongoose.Schema.Types.ObjectId, ref: "Item", required: true },
    itemName:{ type: String, required: true },
    itemPrice: { type: Number, required: true, min: 1 },
    itemQuantity: { type: Number, required: true, min: 1 }
})

const userCartSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    userCart:[cartSchema],
});


Cart = mongoose.model("Cart", userCartSchema)
module.exports = {Cart};

