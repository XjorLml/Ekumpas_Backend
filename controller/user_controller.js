const UserServices = require('../services/user_services');

exports.register = async (req, res, next) => {
  try {
      console.log("---req body---", req.body);
      const { email, password } = req.body;
      const duplicate = await UserServices.getUserByEmail(email);
      if (duplicate) {
          throw new Error(`UserName ${email}, Already Registered`)
      }
      const response = await UserServices.registerUser(email, password);
      res.json({ status: true, success: 'User registered successfully' });
  } catch (err) {
      console.log("---> err -->", err);
      next(err);
  }
}


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
  }
  