const chatController = require('../controllers/chatController');

module.exports = (io) => {
  const chatNamespace = io.of('/chat');

  chatNamespace.on('connection', (socket) => {
    console.log('User connected to chat:', socket.id);

    // Load chat history
    socket.on('load history', async () => {
      const messages = await chatController.getChatHistory();
      socket.emit('chat history', messages);
    });

    // Handle new messages
    socket.on('chat message', async (data) => {
      await chatController.saveMessage(data);
      chatNamespace.emit('chat message', data);
    });

    socket.on('disconnect', () => {
      console.log('User disconnected from chat:', socket.id);
    });
  });
};
