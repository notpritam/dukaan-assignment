import express from "express";
import {
  createChatRoom,
  sendChatMessage,
} from "../controllers/chatController.js";
import verifyToken from "../middleware/authVerifer.js";

const router = express.Router();

// Routes

router.post("/", verifyToken, createChatRoom);
router.post("/messages", verifyToken, sendChatMessage);

export { router };
