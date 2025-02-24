const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./connect");
const authRoutes = require("./routes/authRoutes");
const itemRoutes = require("./routes/itemRoutes");
const orderRoutes = require("./routes/orderRoutes");

const { seedDatabase } = require("./seed");
const app = express();
app.use(express.json());
app.use(cors());

connectDB();
seedDatabase();

// ✅ Use API Routes
app.use("/auth", authRoutes);
app.use("/api", itemRoutes);
app.use("/api", orderRoutes); // ✅ Add order routes

app.listen(5000, () => console.log("Server running on port 5000"));
