const express = require("express");

const router = express.Router();

const {getAllStudents,getMyInfo, uploadProfile}=require('../controllers/userController')

router.get("/all",getAllStudents);
router.get("/:id",getMyInfo)
router.post("/upload/:id",uploadProfile)

module.exports = router;
