import express from "express";

const router = express.Router();

// Routes

router.post("/rooms", createRoom);
router.post("/messages", sendChatMessage);

export default router;
