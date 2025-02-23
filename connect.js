const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        const uri = process.env.MONGO_URI ; // Get URI from environment variables
        if (!uri) {
            throw new Error("MONGO_URI is not defined in environment variables");
        }

        await mongoose.connect(uri);

        console.log("✅ MongoDB connected successfully!");
    } catch (error) {
        console.error("❌ Database connection failed:", error.message);
        process.exit(1); // Stop the server if connection fails
    }
};


module.exports = connectDB;
