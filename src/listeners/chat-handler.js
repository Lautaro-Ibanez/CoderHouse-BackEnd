import MessageManager from "../dao/mongo/mongoManagers/messages-mongo.js";

const messageService = new MessageManager();

const registerChatHandler = (io, socket) => {
  const saveMessage = async (message) => {
    await messageService.createMessage(message);
    const messageLogs = await messageService.getMessagges();
    io.emit("chat:messageLogs", messageLogs);
  };

  const newParticipant = (user) => {
    socket.emit("chat:newConnection");
  };

  socket.on("chat:message", saveMessage);
  socket.on("chat:newParticipant", newParticipant)
};

export default registerChatHandler;