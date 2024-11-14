// const mongoose = require("mongoose");

// const userSchema = new mongoose.Schema(
//   {
//     username: {
//       type: String,
//       required: true,
//       unique: true,
//     },
//     email: {
//       type: String,
//       required: true,
//       unique: true,
//     },
//     password: {
//       type: String,
//       required: true,
//       select: false,
//     },
//     role: {
//       type: String,
//       enum: ["Student", "Admin", "Uploader"],
//       required: true,
//     },
//     // firstName: {
//     //   type: String,
//     //   required: function () {
//     //     return this.role === "Student";
//     //   },
//     // },
//     // lastName: {
//     //   type: String,
//     //   required: function () {
//     //     return this.role === "Student";
//     //   },
//     // },
//     // phone: {
//     //   type: String,
//     //   required: function () {
//     //     return this.role === "Student";
//     //   },
//     //   match: [/^\d{10}$/, "Please enter a valid 10-digit phone number"],
//     // },
//     yearOfJoining: {
//       type: Number,
//       required: function () {
//         return this.role === "Student";
//       },
//     },
//     isVerified: {
//       type: Boolean,
//       default: false,
//     },
//     otp: [
//       {
//         code: { type: String, select: false },
//         expiration: { type: Date, select: false },
//       },
//     ],
//     regulations: [String],
//     resetPasswordToken: String,
//     resetPasswordExpires: Date,
//     events: {
//       type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Event" }],
//       required: function () {
//         return this.role === "Student";
//       },
//     },
//   },
//   { timestamps: true }
// );

// const User = mongoose.model("User", userSchema);

// module.exports = User;

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
      enum: ["Student", "Admin", "Uploader"],
      required: true,
    },
    yearOfJoining: {
      type: Number,
      required: function () {
        return this.role === "Student";
      },
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    events: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event",
      },
    ],
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
