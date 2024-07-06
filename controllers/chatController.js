import { response } from "express";
import ChatRoom from "../models/Chat/ChatRoom.js";
import Message from "../models/Chat/Messages.js";

const createChatRoom = async (req, res) => {
  try {
    const { message, userId } = req.body;
    console.log("message", userId, message);

    const roomName = message;

    const chatRoom = await ChatRoom.create({
      name: roomName,
      userId,
    });

    const messageList = [];

    const mesages = await Message.create({
      roomId: chatRoom.id,
      userId: null,
      content: "How can I help you today?",
      isBot: true,
    });

    const mesages2 = await Message.create({
      roomId: chatRoom.id,
      userId,
      content: message,
      isBot: false,
    });

    messageList.push(mesages);
    messageList.push(mesages2);

    res.json({ chatRoom, response: mesages2 });
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

    const chatRoom = await ChatRoom.findByPk(chatRoomId);

    if (!chatRoom) {
      return res.status(404).json({ message: "Chat room not found" });
    }

    const chatMessage = await chatRoom.createChatMessage({ message });

    res.json({ chatMessage });
  } catch (error) {
    console.error("Error sending chat message:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getChatMessages = async (req, res) => {
  try {
    const { chatRoomId } = req.params;

    const chatRoom = await ChatRoom.findByPk(chatRoomId);

    if (!chatRoom) {
      return res.status(404).json({ message: "Chat room not found" });
    }

    const chatMessages = await chatRoom.getChatMessages();

    res.json({ chatMessages });
  } catch (error) {
    console.error("Error getting chat messages:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export { createChatRoom, sendChatMessage, getChatMessages };
