const mongoose = require('mongoose');
const db = require('../config/db');
const bcrypt = require("bcrypt");

const { Schema } = mongoose;

const userSchema = new Schema({
  role: { 
    type: String, 
    default: 'user' },
    
      email: {
        type: String,
        required: true,
        unique: true,
        validate: {
          validator: (email) => {
            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            return emailRegex.test(email);
          },
          message: 'Invalid email format',
        },
      },

      password: {
        type: String,
        required: true,
        minlength: 8,
      },
    username: {
    type: String,
    unique: true
  },

},{timestamps:true});

userSchema.pre('save', async function(next) {
  try {
    const user = this;
    if (!user.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    const hashpass = await bcrypt.hash(user.password, salt);
    user.password = hashpass;
    user.username = user.email.split('@')[0];
    next();
  } catch (error) {
    throw error;
  }
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    if (!candidatePassword) return false;
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    return isMatch;
  } catch (error) {
    throw error;
  }
};


const UserModel = db.model('MobileUser', userSchema);

module.exports = UserModel;