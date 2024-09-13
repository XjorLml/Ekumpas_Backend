// otp.model.js
const mongoose = require('mongoose');
const db = require('../config/db'); // Import your custom connection

const otpSchema = new mongoose.Schema({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  expiresAt: { type: Date, required: true },
});

// Create the model using the custom connection
const OTPModel = db.model('OTP', otpSchema);

module.exports = OTPModel; // Export the model
