const express = require("express");
const router = express.Router();
const Item = require("../models/item");

// Fetch all items
router.get("/items", async (req, res) => {
    try {
        const items = await Item.find({},"_id name stock price");
        res.json(items);
        console.log(items)
    } catch (error) {
        res.status(500).json({ message: "Error fetching items" });
    }
});


router.delete("/remove",async(req,res)=>{
    try{
        const {itemId}=req.body
        const item=await Item.findByIdAndDelete(itemId)
        console.log(item,"hi")
        res.json({message:"item removed succesfully"})
    }
    catch(error){
        console.log(error);
        res.status(500).json({ message: "Error removing item" });

    }
})

router.put("/update",async (req,res)=>{
    try{
        const updateItem=req.body
        
        const item=await Item.findByIdAndUpdate(updateItem._id,updateItem)
        console.log(thing)
        res.json({message:"successfully updated item"})
        
    }catch(error){
        console.log(error);
        res.status(500).json({ message: "Error updating item" });
    }
})

router.put("/add",async (req,res)=>{

        try{
        const addItem=req.body
        console.log(Item)
        const data=await Item.create(addItem)
        console.log(data)
        res.json({_id:data._id,message:"successfully added item"})
        }catch(error){
            console.log(error);
            res.status(500).json({ message: "Error adding item" });
        }




})
module.exports = router;
