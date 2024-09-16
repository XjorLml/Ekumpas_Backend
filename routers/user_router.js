const router = require('express').Router();
const UserController = require("../controller/user_controller");

router.post("/register",UserController.register);
router.post('/verify-otp', UserController.verifyOTP);
router.post("/login",UserController.login);
router.post('/forgot-password', UserController.requestPasswordReset);
router.post('/verify-reset-otp', UserController.verifyPasswordResetOTP);
module.exports = router;