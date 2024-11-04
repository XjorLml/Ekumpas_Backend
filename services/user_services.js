const UserModel = require('../model/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt'); // Import bcrypt

class UserServices {

    static async registerUser(email, password) {
        try {
            console.log("-----Email --- Password-----", email, password);

            // No manual hashing here; the pre-save hook in userModel.js will handle it
            const createUser = new UserModel({ email, password });
            return await createUser.save();
        } catch (err) {
            throw err;
        }
    }

    static async getUserByEmail(email) {
        try {
            return await UserModel.findOne({ email });
        } catch (err) {
            console.log(err);
        }
    }

    static async checkUser(email) {
        try {
            return await UserModel.findOne({ email });
        } catch (error) {
            throw error;
        }
    }

    static async generateAccessToken(tokenData, JWTSecret_Key, JWT_EXPIRE) {
        return jwt.sign(tokenData, JWTSecret_Key, { expiresIn: JWT_EXPIRE });
    }

    static async markUserAsVerified(email) {
        try {
            return await UserModel.updateOne({ email }, { isVerified: true });
        } catch (error) {
            throw new Error('Error updating user verification status: ' + error.message);
        }
    }

    static async resetPassword(email, newPassword) {
        try {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(newPassword, salt);
            return await UserModel.updateOne({ email }, { password: hashedPassword });
        } catch (error) {
            throw new Error('Error resetting password: ' + error.message);
        }
    }
}

module.exports = UserServices;