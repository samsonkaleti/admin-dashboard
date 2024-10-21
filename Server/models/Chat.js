const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  participants: [{
    type: mongoose.Schema.Types.ObjectId, // References to the User model
    ref: 'User',
    required: true,
  }],
  messages: [{
    sender: {
      type: mongoose.Schema.Types.ObjectId, // Reference to the User model
      ref: 'User',
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    subjectDetails: {
      year: {
        type: Number, // Year of study
        required: true,
      },
      semester: {
        type: Number, // Semester number
        required: true,
      },
      subject: {
        type: String, // Subject name
        required: true,
      },
    },
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create the ChatHistory model
const Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat;
