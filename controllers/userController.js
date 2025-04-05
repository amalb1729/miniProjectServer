
const user=require("../models/user");
const mongoose=require("mongoose");

const multer= require("multer");
const path= require("path");
const fs =require("fs");
const upload = multer({ dest: "public/users/" });

const getAllStudents= async (req, res) => {
    try {
        const users = await user.find({},"_id name department semester");
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Error fetching details" });
    }
}
const getMyInfo= async (req, res) => {
    try {
        const {id}=req.params;
        //const Id=new mongoose.Types.ObjectId(id)
        const users = await user.findById(id);
        res.json(users);
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Error fetching details" });
    }
}

const uploadProfile=()=>{upload.single("file"), (req, res) => {
    const tempPath = req.file.path;
    const targetPath = path.join("public/uploads", req.file.originalname);
  
    fs.rename(tempPath, targetPath, (err) => {
      if (err) return res.status(500).send("File move failed.");
      res.send("Upload successful");
    });
  }};



module.exports={getAllStudents,getMyInfo,uploadProfile}