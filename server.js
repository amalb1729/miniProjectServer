const express = require("express");
const cors = require("cors");
const path=require("path")
require("dotenv").config();
const cookieParser = require("cookie-parser");
const connectDB = require("./connect");
const authRoutes = require("./routes/authRoutes");
const itemRoutes = require("./routes/itemRoutes");
const orderRoutes = require("./routes/orderRoutes");
const userRoutes = require("./routes/userRoutes");
const announcementRoutes = require("./routes/announcementRoutes");
const { seedDatabase } = require("./seed");
const { scheduleCronJobs } = require("./cronJobs");
const app = express();
app.use(express.json());
app.use(cors({
    origin: [process.env.Admin, process.env.User], // frontend dev URL
    credentials: true,
}));

const middle=(req,res,next)=>{
    console.log(req.body);
    next();
}


//seedDatabase();
connectDB();

// Initialize cron jobs
scheduleCronJobs();

// ✅ Use API Routes
//app.use(middle)
app.use((req,res,next)=>{
    console.log(`${req.method} ${req.path} from ${req.ip} with ${req.headers['authorization']}`);
    next();
})
app.use(cookieParser());

//app.use("/images",express.static(path.join(__dirname,"public/images")))
//app.use("/user",express.static(path.join(__dirname,"public/user")))

app.use("/auth", authRoutes);

app.use("/item", itemRoutes);
app.use("/order", orderRoutes);
app.use("/student", userRoutes); // ✅ Add order routes
app.use("/announcement", announcementRoutes); // ✅ Add announcement routes

app.listen(5000,'0.0.0.0', () => console.log("Server running on port 5000"));
