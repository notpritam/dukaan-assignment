import express from "express";
import { userLogin, userRegister } from "../controllers/authController.js";

const router = express.Router();

// Routes

router.post("/login", userLogin);
router.post("/signup", userRegister);

export { router };
