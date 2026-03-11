const express = require("express");
const {initRegister,verifyOtp,resendOtp,register,login} = require("../controllers/auth.Controller");
const {authLimiter,resendOtpLimiter} = require("../middleware/rateLimit.middleware");

const Router = express.Router();

Router.post("/init-register",authLimiter,initRegister);
Router.post("/verify-otp",verifyOtp);
Router.post("/resend-otp",resendOtpLimiter,resendOtp);
Router.post("/register",register);
Router.post("/login",authLimiter,login);

module.exports = Router; 