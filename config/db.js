require('dotenv').config();
const mongoose = require('mongoose');

// Connect to MongoDB without deprecated options
mongoose.connect(process.env.DB_URI, {
  serverSelectionTimeoutMS: 30000, // 30 seconds timeout
  socketTimeoutMS: 45000,          // 45 seconds timeout
})
  .then(() => {
    console.log('MongoDB Connected');
  })
  .catch((err) => {
    console.error('Connection Error:', err);
  });

// Optionally, you can add event listeners for more detailed logging
mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected from MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('Mongoose connection error:', err);
});

module.exports = mongoose;
