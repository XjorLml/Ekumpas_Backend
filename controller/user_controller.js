const UserServices = require('../services/user_services');
const OTPService = require('../services/otp_services'); // Ensure this service has the necessary methods

exports.register = async (req, res, next) => {
  try {
    console.log("---req body---", req.body);
    const { email, password } = req.body;

    // Simple validation
    if (!email || !password) {
      return res.status(400).json({ status: false, message: 'Email and password are required' });
    }

    // Check if user already exists
    const duplicate = await UserServices.getUserByEmail(email);
    if (duplicate) {
      return res.status(409).json({ status: false, message: `Email ${email} is already registered` });
    }

    // Register the user
    const newUser = await UserServices.registerUser(email, password);

    // Generate OTP for email verification
    const otp = OTPService.generateOTP(); // Generate a random OTP
    await OTPService.saveOTP(email, otp); // Save OTP to the database or cache (temporary storage)

    // Send OTP email to the user
    await OTPService.sendOTPEmail(email, otp);

    res.status(201).json({ 
      status: true, 
      message: 'User registered successfully. An OTP has been sent to your email for verification.' 
    });
  } catch (err) {
    console.log("---> err -->", err);
    res.status(500).json({ status: false, message: 'Server error: ' + err.message });
  }
};

// Function for OTP verification
exports.verifyOTP = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    // Check if the OTP matches the stored OTP
    const isValidOTP = await OTPService.verifyOTP(email, otp);
    if (!isValidOTP) {
      return res.status(400).json({ status: false, message: 'Invalid or expired OTP' });
    }

    // Mark the user as verified
    await UserServices.markUserAsVerified(email);

    res.status(200).json({ status: true, message: 'Email verified successfully' });
  } catch (err) {
    console.log("---> err -->", err);
    res.status(500).json({ status: false, message: 'Server error: ' + err.message });
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ status: false, error: 'Email and password are required' });
    }

    const user = await UserServices.checkUser(email);
    if (!user) {
      return res.status(404).json({ status: false, error: 'User does not exist' });
    }

    // Check if user is verified
    if (!user.isVerified) {
      return res.status(403).json({ status: false, error: 'User is not verified. Please check your email for verification instructions.' });
    }

    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ status: false, error: 'Invalid email or password' });
    }

    // Creating Token
    const tokenData = { _id: user._id, email: user.email };
    const token = await UserServices.generateAccessToken(tokenData, "secret", "1h");

    res.status(200).json({ status: true, success: 'Login successful', token: token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ status: false, error: 'Internal server error', details: error.message });
  }
};

exports.requestPasswordReset = async (req, res, next) => {
  try {
    const { email } = req.body;

    // Check if email exists in the database
    const user = await UserServices.getUserByEmail(email);
    if (!user) {
      return res.status(404).json({ status: false, message: 'Email not found' });
    }

    // Generate OTP for password reset
    const otp = OTPService.generateOTP();
    await OTPService.saveOTP(email, otp);

    // Send OTP email to the user
    await OTPService.sendOTPEmail(email, otp, 'password reset');

    res.status(200).json({
      status: true,
      message: 'An OTP has been sent to your email for password reset.',
    });
  } catch (err) {
    console.log("---> err -->", err);
    res.status(500).json({ status: false, message: 'Server error: ' + err.message });
  }
};

// Verify the OTP (only OTP verification)
exports.verifyPasswordResetOTP = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    // Check if the OTP matches
    const isValidOTP = await OTPService.verifyOTP(email, otp);
    if (!isValidOTP) {
      return res.status(400).json({ status: false, message: 'Invalid or expired OTP' });
    }

    res.status(200).json({ status: true, message: 'OTP verified successfully. Proceed to reset password.' });
  } catch (err) {
    console.log("---> err -->", err);
    res.status(500).json({ status: false, message: 'Server error: ' + err.message });
  }
};

// Set new password after OTP verification
exports.setNewPassword = async (req, res, next) => {
  try {
    const { email, newPassword } = req.body;

    // Ensure email and newPassword are provided
    if (!email || !newPassword) {
      return res.status(400).json({ status: false, message: 'Email and new password are required' });
    }

    // Reset the user's password
    await UserServices.resetPassword(email, newPassword);

    res.status(200).json({ status: true, message: 'Password reset successfully' });
  } catch (err) {
    console.log("---> err -->", err);
    res.status(500).json({ status: false, message: 'Server error: ' + err.message });
  }
};

