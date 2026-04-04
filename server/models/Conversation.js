const mongoose = require('mongoose');

// A single message inside a conversation
const messageSchema = new mongoose.Schema({
  sender: {
    type: String,
    enum: ['user', 'bot'],
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

// A conversation is a collection of messages with a title and timestamp
// Use Mongoose built-in timestamps option — it auto-manages createdAt and updatedAt
const conversationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: 'New Conversation',
    },
    messages: [messageSchema],
  },
  {
    // Mongoose handles createdAt and updatedAt automatically — no pre-save hook needed
    timestamps: true,
  }
);

module.exports = mongoose.model('Conversation', conversationSchema);
