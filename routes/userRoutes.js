const express = require("express");

const router = express.Router();

const {getAllStudents}=require('../controllers/userController')

router.get("/all",getAllStudents);

module.exports = router;
