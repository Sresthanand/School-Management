const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  coordinator: {
    id: mongoose.Schema.Types.ObjectId,
    name: String,
  },
  userId: {
    id: mongoose.Schema.Types.ObjectId,
    username: String,
  },
  messageTitle: {
    type: String,
    required: true,
  },
  messageContent: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const MessageModel = mongoose.model("Message", messageSchema);

module.exports = {
  MessageModel,
};
