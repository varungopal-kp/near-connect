const chatController = require("../controllers/chatController");

module.exports = (io) => {
  const chatNamespace = io.of("/chat"); // for localhost:8000/chat

  io.on("connection", (socket) => {
    console.log("User connected to chat:", socket.id);

    socket.on("userOnline", async (userId) => {
      await chatController.setUserOnline(userId, socket.id);
      console.log(`${userId} is online`);
      io.emit("onlineStatus", {
        userId,
        status: "online",
        socketId: socket.id,
      });
    });

    socket.on("typing", (data) => {
      const { sender, receiver } = data;
      const room = [sender, receiver].sort().join("-");
      socket.to(room).emit("typing", { sender });
    });

    socket.on("stopTyping", (data) => {
      const { sender, receiver } = data;
      const room = [sender, receiver].sort().join("-");
      socket.to(room).emit("stopTyping", { sender });
    });

    socket.on("joinRoom", (room) => {
      socket.join(room);
      console.log(`User joined room: ${room}`);
    });

    // Handle new messages
    socket.on("sendMessage", async (data) => {
      const { sender, receiver, message } = data;

      // Save the message to the database
      await chatController.saveMessage({ sender, receiver, message });

      // Emit the message to the receiver's room
      const room = [sender, receiver].sort().join("-");
      io.to(room).emit("receiveMessage", data);
      
    });

    socket.on("disconnect", async () => {
      console.log("User disconnected from chat:", socket.id);
      const user = await chatController.getUserBySocketId(socket.id);
      if (user) {
        const userOffile = await chatController.setUserOffline(socket.id);
        if (userOffile) {
          if (userOffile.online?.socketIds?.length === 0) {
            console.log("User is offline");
            await chatController.setUserOffline(socket.id);
            io.emit("onlineStatus", { userId: user._id, status: "offline" });
          }
        }
      }
    });
  });
};
