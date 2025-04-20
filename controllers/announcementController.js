const Announcement = require("../models/announcement");

// Get all active announcements (public endpoint)
const getActiveAnnouncements = async (req, res) => {
    try {
        const announcements = await Announcement.find({ active: true })
            .sort({ priority: -1, createdAt: -1 })
            .select('text');
        
        res.json(announcements);
    } catch (error) {
        console.error("Error fetching announcements:", error);
        res.status(500).json({ message: "Error fetching announcements" });
    }
};

// Get all announcements (admin only)
const getAllAnnouncements = async (req, res) => {
    try {
        const announcements = await Announcement.find()
            .sort({ priority: -1, createdAt: -1 });
        
        res.json(announcements);
    } catch (error) {
        console.error("Error fetching all announcements:", error);
        res.status(500).json({ message: "Error fetching announcements" });
    }
};

// Create a new announcement (admin only)
const createAnnouncement = async (req, res) => {
    try {
        const { text, active, priority } = req.body;
        
        if (!text) {
            return res.status(400).json({ message: "Announcement text is required" });
        }
        
        // Trim text and remove excessive whitespace
        const trimmedText = text.trim().replace(/\s+/g, ' ');
        
        const newAnnouncement = new Announcement({
            text: trimmedText,
            active: active !== undefined ? active : true,
            priority: priority !== undefined ? priority : 0
        });
        
        const savedAnnouncement = await newAnnouncement.save();
        res.status(201).json(savedAnnouncement);
    } catch (error) {
        console.error("Error creating announcement:", error);
        res.status(500).json({ message: "Error creating announcement" });
    }
};

// Update an announcement (admin only)
const updateAnnouncement = async (req, res) => {
    try {
        const { id } = req.params;
        const { text, active, priority } = req.body;
        
        const announcement = await Announcement.findById(id);
        
        if (!announcement) {
            return res.status(404).json({ message: "Announcement not found" });
        }
        
        if (text !== undefined) {
            announcement.text = text.trim().replace(/\s+/g, ' ');
        }
        if (active !== undefined) announcement.active = active;
        if (priority !== undefined) announcement.priority = priority;
        
        const updatedAnnouncement = await announcement.save();
        res.json(updatedAnnouncement);
    } catch (error) {
        console.error("Error updating announcement:", error);
        res.status(500).json({ message: "Error updating announcement" });
    }
};

// Delete an announcement (admin only)
const deleteAnnouncement = async (req, res) => {
    try {
        const { id } = req.params;
        
        const announcement = await Announcement.findByIdAndDelete(id);
        
        if (!announcement) {
            return res.status(404).json({ message: "Announcement not found" });
        }
        
        res.json({ message: "Announcement deleted successfully" });
    } catch (error) {
        console.error("Error deleting announcement:", error);
        res.status(500).json({ message: "Error deleting announcement" });
    }
};

module.exports = {
    getActiveAnnouncements,
    getAllAnnouncements,
    createAnnouncement,
    updateAnnouncement,
    deleteAnnouncement
};
