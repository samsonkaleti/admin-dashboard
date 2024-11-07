const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    role: {
      type: String,
      enum: ["student", "admin", "uploader"],
      default: "student",
      required: true,
    },
    firstName: {
      type: String,
      required: function () {
        return this.role === "student";
      },
    },
    lastName: {
      type: String,
      required: function () {
        return this.role === "student";
      },
    },
    phone: {
      type: String,
      required: function () {
        return this.role === "student";
      },
      match: [/^\d{10}$/, "Please enter a valid 10-digit phone number"],
    },
    yearOfJoining: {
      type: Number,
      required: function () {
        return this.role === "student";
      },
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    otp: [
      {
        code: { type: String, select: false },
        expiration: { type: Date, select: false },
      },
    ],
    regulations: [String],

    resetPasswordToken: String,
    resetPasswordExpires: Date,
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
