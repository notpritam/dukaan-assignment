import express from "express";
import { interactWithChatbot } from "../controllers/botController";
const router = express.Router();

// Chatbot interaction route
router.post("/interact", interactWithChatbot);

module.exports = router;
