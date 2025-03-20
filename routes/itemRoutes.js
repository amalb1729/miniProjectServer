const express = require("express");
const router = express.Router();
const {viewAll,removeItem,updateItem,addItem}=require('../controllers/itemController')
const Item = require("../models/item");


// Fetch all items
router.get("/items",viewAll);

router.delete("/remove",removeItem)

router.put("/update",updateItem)

router.put("/add",addItem)

module.exports = router;
