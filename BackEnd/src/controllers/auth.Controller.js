const User = require("../models/User");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const PendingUsers = require("../models/PendingUsers");
const jwt = require("jsonwebtoken");
const generateOtp = require("../utils/generateOtp");
const { sendOtpEmail } = require("../services/email.service");

//init-register => email verification
exports.initRegister = async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: "name and email are required",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(400).json({
        status: false,
        message: "Email already registered",
      });
    }

    //deleting existing pending user
    await PendingUsers.deleteOne({ email: normalizedEmail });

    //generate otp
    const otp = generateOtp();

    //hash otp
    const otpHash = await bcrypt.hash(otp, 10);

    //otp expiry
    const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);

    //saving pending user
    const pendingUser = await PendingUsers.create({
      name: name.trim(),
      email: normalizedEmail,
      otpHash,
      otpExpiresAt,
      lastOtpSentAt: new Date(),
      attempts: 0,
    });

    //send otp email
    await sendOtpEmail(normalizedEmail, otp);

    //response
    return res.status(200).json({
      success: true,
      message: "otp has sent successfully",
    });
  } catch (error) {
    console.error("Init Register Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

//verify otp
exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    //  validation
    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Find pending user
    const pendingUser = await PendingUsers.findOne({
      email: normalizedEmail,
    });

    if (!pendingUser) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP",
      });
    }

    //  Check expiry
    if (pendingUser.otpExpiresAt < new Date()) {
      await PendingUsers.deleteOne({ email: normalizedEmail });

      return res.status(400).json({
        success: false,
        message: "OTP expired",
      });
    }

    // Check attempt limit
    if (pendingUser.attempts >= 5) {
      await PendingUsers.deleteOne({ email: normalizedEmail });

      return res.status(400).json({
        success: false,
        message: "Too many failed attempts",
      });
    }

    // Compare OTP
    const isMatch = await bcrypt.compare(otp, pendingUser.otpHash);

    if (!isMatch) {
      pendingUser.attempts += 1;
      await pendingUser.save();

      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // OTP is valid -> generate short-lived verification token
    const verificationToken = jwt.sign(
      {
        email: pendingUser.email,
        name: pendingUser.name,
        purpose: "register",
      },
      process.env.JWT_SECRET,
      { expiresIn: "5m" },
    );

    return res.status(200).json({
      success: true,
      message: "OTP verified",
      verificationToken,
    });
  } catch (error) {
    console.error("Verify OTP Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

//Register
exports.register = async (req, res) => {
  try {
    const { password, verificationToken } = req.body;

    if (!password || !verificationToken) {
      return res.status(400).json({
        success: false,
        message: "password and verificationToken are required",
      });
    }

    //verify token
    let decoded;
    try {
      decoded = jwt.verify(verificationToken, process.env.JWT_SECRET);
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: "invalid or expired verification token",
      });
    }

    //ensure correct purpose
    if (decoded.purpose !== "register") {
      return res.status(400).json({
        success: false,
        message: "invalid token purpose",
      });
    }

    const { email, name } = decoded;

    let existUser = await User.findOne({ email });
    if (existUser) {
      return res
        .status(400)
        .json({
          success: false,
          message: "User Already Exist with this credential",
        });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "member",
    });

    await PendingUsers.deleteOne({ email });

    const loginToken = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "5d",
      },
    );

    return res.status(200).json({
      success: true,
      message: "User Registered Successfully",
      token: loginToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.resendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "email is required",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const pendingUser = await PendingUsers.findOne({ email: normalizedEmail });

    if (!pendingUser) {
      return res.status(400).json({
        success: false,
        message: "No pending registration found ,register from start",
      });
    }

    const now = new Date();
    const cooldown = (now - pendingUser.lastOtpSentAt) / 1000;

    if (cooldown < 30) {
      return res.status(400).json({
        success: false,
        message: "please try again after 30 seconds",
      });
    }

    const otp = generateOtp();

    const otpHash = await bcrypt.hash(otp, 10);

    const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);

    //updating pending user
    pendingUser.otpHash = otpHash;
    pendingUser.otpExpiresAt = otpExpiresAt;
    pendingUser.lastOtpSentAt = new Date();
    pendingUser.attempts = 0;

    await pendingUser.save();

    //send new otp
    await sendOtpEmail(normalizedEmail, otp);

    return res.status(200).json({
      success: true,
      message: "new OTP has sent successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "error in resendOtp",
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "invalid credential" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "invalid credential" });
    }

    let token = await jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "2d",
      },
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
