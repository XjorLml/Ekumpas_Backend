const nodemailer = require('nodemailer');
const OTPModel = require('../model/otp.model'); // A model to store OTP (optional, can use Redis or in-memory store)

// Generate OTP
exports.generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000); // Generates a 6-digit OTP
};

// Save OTP to database (or cache)
exports.saveOTP = async (email, otp) => {
    try {
      await OTPModel.create({ email, otp, expiresAt: Date.now() + 10 * 60 * 1000 });
    } catch (error) {
      console.error('Error saving OTP:', error.message);
      console.error('Error stack:', error.stack);
      throw error;
    }
  };
  

// Verify OTP
exports.verifyOTP = async (email, otp) => {
  const record = await OTPModel.findOne({ email, otp });
  if (!record || record.expiresAt < Date.now()) {
    return false; // OTP is invalid or expired
  }
  return true;
};

// Send OTP via email
exports.sendOTPEmail = async (email, otp) => {
  let transporter = nodemailer.createTransport({
    service: 'Gmail', // Or any email service you are using
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: '"Ekumpas OTP" <powerpupbois@gmail.com>', // Sender address
    to: email, // Receiver's email
    subject: 'Your OTP Code', // Subject line
    text: `Your OTP code is ${otp}. It will expire in 10 minutes.`, // Plain text body
  });
};
