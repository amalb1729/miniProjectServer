const Item = require("../models/item");

const viewAll= async (req, res) => {
    try {
        const items = await Item.find({},"_id name stock price");
        res.json(items);
        console.log(items)
    } catch (error) {
        res.status(500).json({ message: "Error fetching items" });
    }
}

const removeItem=async(req,res)=>{
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
}

const updateItem=async (req,res)=>{
    try{
        const updateItem=req.body
        
        const item=await Item.findByIdAndUpdate(updateItem._id,updateItem)
        res.json({message:"successfully updated item"})
        
    }catch(error){
        console.log(error);
        res.status(500).json({ message: "Error updating item" });
    }
}

const addItem=async (req,res)=>{

    try{
    const addItem=req.body
    const check=await Item.findOne({name:addItem.name})
    if(check){
        res.status(500).json({message:"item already exists"})
    }
    else{
        const data=await Item.create(addItem)
        res.json({_id:data._id,message:"successfully added item"})
    }
    
    }catch(error){
        console.log(error);
        res.status(500).json({ message: "Error adding item" });
    }
}

module.exports={viewAll,removeItem,updateItem,addItem}