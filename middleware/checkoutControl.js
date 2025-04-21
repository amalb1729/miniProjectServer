// Middleware to control checkout functionality
// This is a simple in-memory solution that can be toggled by admins

// Global variable to track checkout status (default: enabled)
let checkoutEnabled = true;

// Middleware to check if checkout is enabled
const verifyCheckoutEnabled = (req, res, next) => {
    if (checkoutEnabled) {
        next(); // Checkout is enabled, proceed to the next middleware/controller
    } else {
        return res.status(403).json({ 
            message: "Checkout is currently disabled by the administrator. Please try again later."
        });
    }
};

// Function to get current checkout status
const getCheckoutStatus = () => {
    return checkoutEnabled;
};

// Function to toggle checkout status (to be used by admin routes)
const toggleCheckout = () => {
    checkoutEnabled = !checkoutEnabled;
    return checkoutEnabled;
};

module.exports = {
    verifyCheckoutEnabled,
    getCheckoutStatus,
    toggleCheckout
};
