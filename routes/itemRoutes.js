const express = require("express");
const router = express.Router();
const {viewAll,removeItem,updateItem,addItem,uploadVerification,uploadItem,getItemStock}=require('../controllers/itemController')
const Item = require("../models/item");
const verifyJWT = require("../middleware/verifyJWT");
const verifyAdmin = require("../middleware/verifyAdmin");


// Fetch all items
router.get("/items",viewAll);

router.use(verifyJWT);

//admin - requires admin role
router.delete("/remove", verifyAdmin, removeItem)
router.put("/update", verifyAdmin, updateItem)
router.put("/add", verifyAdmin, addItem)


//user
router.get("/stock",getItemStock);
router.get("/uploadCheck",uploadVerification);
router.post("/upload/:id",uploadItem)

module.exports = router;
