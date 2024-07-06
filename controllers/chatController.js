import ChatRoom from "../models/Chat/ChatRoom";

const createChatRoom = async (req, res) => {
  try {
    const { name, description, price } = req.body;

    const chatRoom = await ChatRoom.create({
      name,
      description,
      price,
    });

    res.json({ chatRoom });
  } catch (error) {
    console.error("Error creating chat room:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
