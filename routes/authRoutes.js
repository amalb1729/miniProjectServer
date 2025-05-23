const express = require("express");
const { register, login, refreshToken, logout, adminLogin } = require("../controllers/authController");

const router = express.Router();
const verifyJWT = require("../middleware/verifyJWT");
router.post("/register", register);

router.post("/login", login);

// Admin-specific login route
router.post("/admin/login", adminLogin);

router.post("/token", refreshToken);
router.post("/logout", logout);
router.use(verifyJWT);
router.get("/protected",(req, res) => {
    res.json({ message: 'Protected data', user: req.user });
});

module.exports = router;
