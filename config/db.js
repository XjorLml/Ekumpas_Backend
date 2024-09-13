require ('dotenv').config();
const mongoose = require('mongoose');

const connection = mongoose.createConnection(process.env.DB_URI)
  .on('open', () => {
    
    console.log("MongoDB Connected");
  })
  .on('error', (err) => {
    console.error("Connection Error:", err);
  });

module.exports = connection;
