const mongoose = require("mongoose");
const connectDB = require("./connect");
const Item = require("./models/item");

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
        await Item.deleteMany(); // Clear existing data
        await Item.insertMany(seedItems); // Insert sample data
        console.log("✅ Sample items added to the database!");
       // process.exit(); // Exit script after completion
    } catch (error) {
        console.error("❌ Error seeding database:", error);
        process.exit(1);
    }
}

module.exports = { seedDatabase }
