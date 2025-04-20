const express = require("express");
const router = express.Router();
const {viewAll,removeItem,updateItem,addItem,uploadVerification,uploadItem,getItemStock}=require('../controllers/itemController')
const Item = require("../models/item");
const verifyJWT = require("../middleware/verifyJWT");


// Fetch all items
router.get("/items",viewAll);

router.use(verifyJWT);

//admin
router.delete("/remove",removeItem)
router.put("/update",updateItem)
router.put("/add",addItem)


//user
router.get("/stock",getItemStock);
router.get("/uploadCheck",uploadVerification);
router.post("/upload/:id",uploadItem)

module.exports = router;
