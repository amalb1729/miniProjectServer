const express = require("express");
const router = express.Router();
const Item = require("../models/item");

// Fetch all items
router.get("/view", async (req, res) => {
    try {
        const items = await Item.find();
        res.json(items);
        console.log(items)
    } catch (error) {
        res.status(500).json({ message: "Error fetching items" });
    }
});

module.exports = router;
