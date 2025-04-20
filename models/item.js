const mongoose = require("mongoose");

const ItemSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true }, // Remaining stock
    pictureURL:{type: String},
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Item", ItemSchema);
