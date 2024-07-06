import express from "express";
import {
  createChatRoom,
  getAllRooms,
  getChatMessages,
  sendChatMessage,
} from "../controllers/chatController.js";
import verifyToken from "../middleware/authVerifer.js";
import { ro } from "@faker-js/faker";

const router = express.Router();

// Routes

router.get("/", verifyToken, getAllRooms);

router.post("/", verifyToken, createChatRoom);
router.post("/messages", verifyToken, sendChatMessage);

router.get("/:id", verifyToken, getChatMessages);

export { router };
