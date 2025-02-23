const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./connect");
const authRoutes = require("./routes/authRoutes");

const app = express();
app.use(express.json());
app.use(cors());

connectDB();

// ✅ Use Authentication Routes
app.use("/auth", authRoutes);

// ✅ Start Server
app.listen(5000, () => console.log("Server running on port 5000"));
