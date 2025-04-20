const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
  token: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  createdAt: { type: Date, default: Date.now, expires: '7d' } // auto-delete after 7 days
});

module.exports = mongoose.model('Token', tokenSchema);