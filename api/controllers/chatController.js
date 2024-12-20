const Chat = require("../models/chat");

// Fetch chat history
exports.getChatHistory = async (userId) => {
  try {
    const chats = await Chat.find({});
    return chats;
  } catch (error) {
    return error;
  }
};

// Save a new chat
exports.saveMessage = async (data) => {
  try {
    const chat = new Chat(data);
    await chat.save();
    return chat;
  } catch (err) {
    return err;
  }
};
