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
      content: message.isBot
        ? message.content
        : message.content +
          `Do not give me any information about procedures and service features that are not mentioned in the PROVIDED CONTEXT.
          Today Date is ${Date.now()}.`,
    };
  });

  return formattedMessages;
};

export { formatMessageforAI };
