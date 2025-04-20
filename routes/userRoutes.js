const express = require("express");

const router = express.Router();

const {getAllStudents,getMyInfo, uploadProfile,uploadVerification}=require('../controllers/userController')

const verifyJWT = require("../middleware/verifyJWT");
const verifyAdmin = require("../middleware/verifyAdmin");
router.use(verifyJWT);

// Admin only route - requires admin role
router.get("/all", verifyAdmin, getAllStudents);
router.get("/myInfo/:id",getMyInfo)
router.post("/upload/:id",uploadProfile)
router.get("/uploadCheck",uploadVerification)

module.exports = router;
