const User = require("../models/User");
const generateOTP = require("../utils/otpGenerator");
const { sendOTP } = require("../services/emailService");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const redisClient = require("../config/redis"); // Redis client

// User Signup
exports.signup = async (req, res) => {
  const { username, email, password, role, yearOfJoining } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      role,
      yearOfJoining,
      isVerified: false,
    });

    const otp = generateOTP();
    console.log(otp); // Generate OTP
    await sendOTP(newUser.email, otp); // Send OTP via email

    // Store OTP and its expiration time in the user model
    newUser.otp.push({
      code: otp,
      expiration: Date.now() + 5 * 60 * 1000, // Expires in 5 minutes
    });
    await newUser.save();

    return res.status(200).json({
      message: "User registered successfully, OTP sent to email",
      userId: newUser._id,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error registering user", error: error.message });
  }
};

// Verify OTP
exports.verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the provided OTP exists and is not expired
    const otpEntry = user.otp.find(
      (entry) => entry.code === otp && entry.expiration > Date.now()
    );

    if (otpEntry) {
      // Update the user's isVerified status
      user.isVerified = true;

      // Remove the used OTP from the array
      user.otp = user.otp.filter((entry) => entry.code !== otp); // Remove the used OTP
      await user.save();

      return res
        .status(200)
        .json({ message: "OTP verified successfully, you can now log in" });
    } else {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error verifying OTP", error: error.message });
  }
};

// User Login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the user is verified
    if (!user.isVerified) {
      return res.status(400).json({
        message: "User not verified. Please verify the OTP sent to your email",
      });
    }

    // Compare the entered password with the stored hash
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // If verified and password is correct, generate a JWT token
    const token = jwt.sign(
      { email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    return res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error logging in", error: error.message });
  }
};
