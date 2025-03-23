const express = require("express");
const cors = require("cors");
const path=require("path")
require("dotenv").config();
const connectDB = require("./connect");
const authRoutes = require("./routes/authRoutes");
const itemRoutes = require("./routes/itemRoutes");
const orderRoutes = require("./routes/orderRoutes");

const { seedDatabase } = require("./seed");
const app = express();
app.use(express.json());
app.use(cors());


const middle=(req,res,next)=>{
    console.log(req.body);
    next();
}


//seedDatabase();
connectDB();


// ✅ Use API Routes
app.use(middle)
app.use((req,res,next)=>{
    console.log(`${req.method} ${req.path} from ${req.ip}`);
    next();
})

app.use("/images",express.static(path.join(__dirname,"public/images")))
app.use("/auth", authRoutes);

app.use("/item", itemRoutes);
app.use("/order", orderRoutes); // ✅ Add order routes

app.listen(5000,'192.168.192.158', () => console.log("Server running on port 5000"));
