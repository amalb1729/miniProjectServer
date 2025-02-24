const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    department: { type: String, required: true },
    semester: { type: Number, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" } // New field
});

module.exports = mongoose.model("User", UserSchema);
