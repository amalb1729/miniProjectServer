const mongoose = require("mongoose");
const Item = require("./models/item");
require("dotenv").config();

const seedItems = [
    // Study Records & Notebooks
    { name: "Fair Record", price: 100, stock: 10 },
    { name: "Fair Record (with graph)", price: 110, stock: 5 },
    { name: "Lab Manual", price: 80, stock: 15 },
    { name: "Rough Record", price: 50, stock: 20 },
    { name: "Rough Record Ruled", price: 60, stock: 12 },
    { name: "Notebook", price: 50, stock: 25 },
    
    // Basic Stationery
    { name: "Ballpoint Pen (Blue)", price: 15, stock: 100 },
    { name: "Ballpoint Pen (Black)", price: 15, stock: 100 },
    { name: "Gel Pen Set", price: 45, stock: 50 },
    { name: "Mechanical Pencil", price: 25, stock: 75 },
    { name: "Pencil Set (12 pcs)", price: 30, stock: 40 },
    { name: "Eraser Pack", price: 10, stock: 150 },
    { name: "Sharpener", price: 8, stock: 100 },
    
    // Advanced Stationery
    { name: "Scientific Calculator", price: 850, stock: 15 },
    { name: "Geometry Box", price: 120, stock: 30 },
    { name: "Graph Book", price: 40, stock: 45 },
    { name: "Drawing Board", price: 200, stock: 20 },
    
    // Art Supplies
    { name: "Color Pencil Set (24 colors)", price: 180, stock: 25 },
    { name: "Water Color Set", price: 150, stock: 20 },
    { name: "Sketch Pens Set", price: 90, stock: 35 },
    
    // Paper Products
    { name: "A4 Paper Ream (500 sheets)", price: 300, stock: 30 },
    { name: "Sticky Notes Pack", price: 40, stock: 60 },
    { name: "Index Cards (100 pcs)", price: 35, stock: 45 },
    
    // Storage & Organization
    { name: "File Folder", price: 25, stock: 80 },
    { name: "Pencil Case", price: 75, stock: 40 },
    { name: "Document Holder", price: 120, stock: 25 },
    
    // Electronics
    { name: "USB Flash Drive (32GB)", price: 450, stock: 20 },
    { name: "Scientific Calculator Batteries", price: 25, stock: 100 },
    
    // Miscellaneous
    { name: "ID Card Holder", price: 30, stock: 100 },
    { name: "Stapler", price: 85, stock: 30 },
    { name: "Staple Pins Box", price: 15, stock: 150 },
    { name: "Paper Clips Box", price: 20, stock: 100 }
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
