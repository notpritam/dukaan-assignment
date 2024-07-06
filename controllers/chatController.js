import ChatRoom from "../models/Chat/ChatRoom.js";
import Message from "../models/Chat/Messages.js";
import { formatMessageforAI } from "../utils/messages.js";
import { interactWithChatbot } from "./botController.js";

const createChatRoom = async (req, res) => {
  try {
    const { message } = req.body;
    const userId = req.userId;
    console.log("message", userId, message);

    const roomName = message.split(" ").slice(0, 3).join(" ");

    const chatRoom = await ChatRoom.create({
      name: roomName,
      userId,
    });

    const messageList = [];

    const mesages = await Message.create({
      roomId: chatRoom.id,
      userId: null,
      content:
        "You are a chat bot for a hotel booking service whose company name is Crestview Hotel. You can help users book hotel rooms, check availability, and get booking details. You can also provide information about the company and its services. You can also help users with general queries. also return the data in a structured html format.",
      isBot: true,
    });

    const mesages1 = await Message.create({
      roomId: chatRoom.id,
      userId: null,
      content: "Hello, how can I help you today?",
      isBot: true,
    });

    const mesages2 = await Message.create({
      roomId: chatRoom.id,
      userId,
      content: message,
      isBot: false,
    });

    messageList.push(mesages);
    messageList.push(mesages1);
    messageList.push(mesages2);

    const formattedMessage = await formatMessageforAI(chatRoom.id);

    const botMessage = await interactWithChatbot({
      messages: formattedMessage,
      userId,
    });

    const newMessage = await Message.create({
      roomId: chatRoom.id,
      userId: null,
      content: botMessage.content,
      isBot: true,
    });

    res.json({ message: newMessage, chatRoom });
  } catch (error) {
    console.error("Error creating chat room:", error);
    if (error.name === "SequelizeDatabaseError") {
      return res.status(500).json({ message: "Table does not exist" });
    }
    if (error.name === "SequelizeForeignKeyConstraintError") {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const sendChatMessage = async (req, res) => {
  try {
    const { chatRoomId, message } = req.body;
    const userId = req.userId;

    console.log("chatRoomId", chatRoomId, "message", message, "userId", userId);

    const chatRoom = await ChatRoom.findByPk(chatRoomId);

    if (!chatRoom) {
      return res.status(404).json({ message: "Chat room not found" });
    }

    const chatMessage = await Message.create({
      roomId: chatRoomId,
      userId,
      content: message,
      isBot: false,
    });

    const formattedMessage = await formatMessageforAI(chatRoomId);

    const botMessage = await interactWithChatbot({
      messages: formattedMessage,
      userId,
    });

    const newMessage = await Message.create({
      roomId: chatRoomId,
      userId: null,
      content: botMessage.content,
      isBot: true,
    });

    res.json({ message: newMessage });
  } catch (error) {
    console.error("Error sending chat message:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getChatMessages = async (req, res) => {
  try {
    const { id } = req.params;

    const chatRoom = await ChatRoom.findByPk(id);

    if (!chatRoom) {
      return res.status(404).json({ message: "Chat room not found" });
    }

    const chatMessages = await Message.findAll({
      where: {
        roomId: id,
      },
      order: [["createdAt", "ASC"]],
    });

    res.json({
      chatMessages: chatMessages.slice(1),
    });
  } catch (error) {
    console.error("Error getting chat messages:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getAllRooms = async (req, res) => {
  try {
    const chatRooms = await ChatRoom.findAll({
      where: {
        userId: req.userId,
      },
      order: [["createdAt", "DESC"]],
    });

    res.json({ chatRooms });
  } catch (error) {
    console.error("Error getting chat rooms:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export { createChatRoom, sendChatMessage, getChatMessages, getAllRooms };
