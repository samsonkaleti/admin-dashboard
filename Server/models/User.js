const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: /.+\@.+\..+/,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['Student', 'Admin', 'Uploader'],
    required: true,
  },
  college: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'College',
  },
  yearOfJoining: {
    type: Number,
    required: true,
  },
  regulations: [{
    type: String,
  }],
  profile: {
    firstName: String,
    lastName: String,
    phone: String,
  },
  isVerified: {
    type: Boolean,
    default: false, // Default to false, meaning the user is not verified initially
  },
  otp: [{ 
    code: { type: String, required: true },  // OTP code
    expiration: { type: Date, required: true } // OTP expiration time
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
