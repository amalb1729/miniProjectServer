
const User=require("../models/user");
const mongoose=require("mongoose");

const ImageKit = require('imagekit');

const imagekit = new ImageKit({
  urlEndpoint: process.env.PUBLIC_URL_ENDPOINT,
  publicKey: process.env.PUBLIC_PUBLIC_KEY,
  privateKey: process.env.PRIVATE_KEY
});

const getAllStudents= async (req, res) => {
    try {
        const users = await User.find({},"_id name department semester pictureURL");
        res.json(users);
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Error fetching details" });
    }
}

const uploadVerification= (req, res)=> {
    var result = imagekit.getAuthenticationParameters();
    res.send(result);
  };


const getMyInfo= async (req, res) => {
    try {
        const {id}=req.params;
        //const Id=new mongoose.Types.ObjectId(id)
        const users = await User.findById(id);
        res.json(users);
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Error fetching details" });
    }
}

const uploadProfile=async(req,res)=>{
    try {
        const {id}=req.params;
        const {url}=req.body;
        const user = await User.findByIdAndUpdate(id,{pictureURL:url});
        res.json({
            url:url
    });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Error fetching details" });
    }
  };

module.exports={getAllStudents,getMyInfo,uploadProfile,uploadVerification}