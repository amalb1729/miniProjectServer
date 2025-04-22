const mongoose = require('mongoose');
const Order = require('../models/orderModel');
const User = require('../models/userModel');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: '../.env' });

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Function to clean up orders without valid user IDs
const cleanupInvalidOrders = async () => {
  try {
    // Get all orders
    const orders = await Order.find();
    console.log(`Total orders found: ${orders.length}`);

    // Track invalid orders
    let invalidOrders = 0;
    const invalidOrderIds = [];

    // Check each order for a valid user ID
    for (const order of orders) {
      if (!order.userId) {
        invalidOrders++;
        invalidOrderIds.push(order._id);
        continue;
      }

      // Check if user exists in the database
      const user = await User.findById(order.userId);
      if (!user) {
        invalidOrders++;
        invalidOrderIds.push(order._id);
      }
    }

    console.log(`Found ${invalidOrders} orders with invalid or missing user IDs`);

    // Delete invalid orders
    if (invalidOrders > 0) {
      const deleteResult = await Order.deleteMany({ _id: { $in: invalidOrderIds } });
      console.log(`Deleted ${deleteResult.deletedCount} invalid orders`);
    } else {
      console.log('No invalid orders to delete');
    }

    mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error during cleanup:', error);
    mongoose.connection.close();
  }
};

// Run the script
connectDB().then(cleanupInvalidOrders);
