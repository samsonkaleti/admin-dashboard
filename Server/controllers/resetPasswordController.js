const crypto = require("crypto");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const { sendResetPasswordEmail } = require("../services/emailService");

exports.resetPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      // Generic response for security purposes
      return res
        .status(200)
        .json({ message: "If the user exists, a reset email has been sent" });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    await sendResetPasswordEmail(user.email, resetToken);

    return res
      .status(200)
      .json({ message: "Reset password email sent successfully" });
  } catch (error) {
    console.error("Reset password error:", error);
    return res.status(500).json({
      message: "Error sending reset password email",
      error: error.message,
    });
  }
};

exports.confirmResetPassword = async (req, res) => {
  const { resetToken, newPassword } = req.body;

  // Password validation (example: at least 8 characters, alphanumeric)
  if (newPassword.length < 8 || !/\d/.test(newPassword)) {
    return res
      .status(400)
      .json({
        message: "Password must be at least 8 characters and include a number",
      });
  }

  try {
    const user = await User.findOne({
      resetPasswordToken: resetToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid or expired reset token" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    // Optional: Send a notification email upon successful password reset

    return res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Confirm reset password error:", error);
    return res.status(500).json({
      message: "Error resetting password",
      error: error.message,
    });
  }
};
