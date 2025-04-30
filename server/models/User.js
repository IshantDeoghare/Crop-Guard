const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firebaseUid: {
    type: String,
    required: true,
    unique: true,
    index: true, // Index for faster lookups
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  // Add other fields as needed (e.g., location, saved predictions)
});

module.exports = mongoose.model('User', userSchema);
