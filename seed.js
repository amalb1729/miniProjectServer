const mongoose = require("mongoose");
const Item = require("./models/item");
require("dotenv").config();

const seedItems = [
    { name: "Fair Record", price: 100, stock: 10 },
    { name: "Fair Record (with graph)", price: 110, stock: 5 },
    { name: "Lab Manual", price: 80, stock: 15 },
    { name: "Rough Record", price: 50, stock: 20 },
    { name: "Rough Record Ruled", price: 60, stock: 12 },
    { name: "Notebook", price: 50, stock: 25 }
];

async function seedDatabase() {
    await connectDB(); // Connect to database

    try {
        const data= await Item.deleteMany(); // Clear existing data
        console.log(data)
        await Item.insertMany(seedItems); // Insert sample data
        console.log("✅ Sample items added to the database!");
       // process.exit(); // Exit script after completion
    } catch (error) {
        console.error("❌ Error seeding database:", error);
        //process.exit(1);
    }
}

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

//seedDatabase();
module.exports = { seedDatabase }
