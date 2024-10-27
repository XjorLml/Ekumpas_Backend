const mongoose = require('mongoose');
const db = require('../config/db');
const bcrypt = require("bcrypt");

const { Schema } = mongoose;

const userSchema = new Schema({
    role: {
        type: String,
        default: 'user'
    },

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

    // OTP for email verification
    otp: {
        type: String,
        required: false,
    },

    // Track whether the user is verified
    isVerified: {
        type: Boolean,
        default: false,
    }

}, { timestamps: true });

// Hashing password before saving the user
userSchema.pre('save', async function(next) {
    try {
        const user = this;
        if (!user.isModified('password')) return next();
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
