const mongoose = require("mongoose");

const ChatSchema = new mongoose.Schema({
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  subjectDetails: {
    year: String,
    semester: String,
    subject: String,
    units: [String],
    regulation: String,
  },
  messages: [
    {
      sender: mongoose.Schema.Types.ObjectId,
      content: String,
      isBot: Boolean,
    },
  ],
  relevantPdfs: [
    {
      name: { type: String, required: true },
      fileData: { type: String, required: true }, // Base64 encoded data
    },
  ],
});

const Chat = mongoose.model("Chat", ChatSchema);
module.exports = Chat;
