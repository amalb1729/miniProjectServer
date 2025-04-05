const express = require("express");

const router = express.Router();

const {getAllStudents,getMyInfo, uploadProfile,uploadVerification}=require('../controllers/userController')

router.get("/all",getAllStudents);
router.get("/myInfo/:id",getMyInfo)
router.post("/upload/:id",uploadProfile)

router.get("/uploadCheck",uploadVerification)

module.exports = router;
