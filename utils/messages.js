import Message from "../models/Chat/Messages.js";

const formatMessageforAI = async (roomId) => {
  const messages = await Message.findAll({
    where: {
      roomId,
    },
    order: [["createdAt", "ASC"]],
  });

  // Format messages for AI with the first message role as "system"
  const formattedMessages = messages.map((message, index) => {
    return {
      role: index === 0 ? "system" : message.isBot ? "assistant" : "user",
      content: message.content,
    };
  });

  return formattedMessages;
};

export { formatMessageforAI };
