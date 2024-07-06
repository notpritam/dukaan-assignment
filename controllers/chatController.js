import ChatRoom from "../models/Chat/ChatRoom.js";

const createChatRoom = async (req, res) => {
  try {
    const { message, userId } = req.body;

    const roomName = message.split(" ").slice(1).join(" ");

    const chatRoom = await ChatRoom.create({
      name: roomName,
      userId,
    });

    res.json({ chatRoom });
  } catch (error) {
    console.error("Error creating chat room:", error);
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

export { createChatRoom, sendChatMessage };
