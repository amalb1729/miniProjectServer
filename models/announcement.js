const mongoose = require("mongoose");

const AnnouncementSchema = new mongoose.Schema({
    text: { type: String, required: true, trim: true },
    active: { type: Boolean, default: true },
    priority: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Update the updatedAt timestamp before saving
AnnouncementSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model("Announcement", AnnouncementSchema);
