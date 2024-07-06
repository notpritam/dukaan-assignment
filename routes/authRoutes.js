import express from "express";
import { userRegister } from "../controllers/authController";

const router = express.Router();

// Routes

router.post("/login", userLogin);
router.post("/signup", userRegister);

export default router;
