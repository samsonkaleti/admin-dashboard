const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['student', 'admin', 'uploader'],
    required: true
  },
  firstName: {
    type: String,
    required: function() {
      return this.role === 'student';
    }
  },
  lastName: {
    type: String,
    required: function() {
      return this.role === 'student';
    }
  },
  phone: {
    type: String,
    required: function() {
      return this.role === 'student';
    }
  },
  yearOfJoining: {
    type: Number,
    required: function() {
      return this.role === 'student';
    }
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  otp: [
    {
      code: String,
      expiration: Date
    }
  ],
  regulations: [String] ,

  resetPasswordToken: {
    type: String,
    default: undefined
  },
  resetPasswordExpires: {
    type: Date,
    default: undefined
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;