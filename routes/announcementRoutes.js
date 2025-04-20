const express = require("express");
const router = express.Router();
const verifyJWT = require("../middleware/verifyJWT");
const verifyAdmin = require("../middleware/verifyAdmin");
const {
    getActiveAnnouncements,
    getAllAnnouncements,
    createAnnouncement,
    updateAnnouncement,
    deleteAnnouncement
} = require("../controllers/announcementController");

// Public route - Get active announcements
router.get("/active", getActiveAnnouncements);

// Routes that require authentication
router.use(verifyJWT);

// Admin routes - requires admin role
router.get("/", verifyAdmin, getAllAnnouncements);
router.post("/", verifyAdmin, createAnnouncement);
router.put("/:id", verifyAdmin, updateAnnouncement);
router.delete("/:id", verifyAdmin, deleteAnnouncement);

module.exports = router;
