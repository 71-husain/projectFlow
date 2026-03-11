const rateLimit = require("express-rate-limit");

// General limiter (for login, OTP routes)
exports.authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // 20 requests per window per IP
  message: {
    success: false,
    message: "Too many requests. Please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Strict limiter (for resend OTP)
exports.resendOtpLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 5, // only 5 resend requests in 5 minutes
  message: {
    success: false,
    message: "Too many OTP requests. Try again later.",
  },
});