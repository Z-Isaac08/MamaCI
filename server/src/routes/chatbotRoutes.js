import express from "express";
import * as chatbotController from "../controllers/chatbotController.js";

const router = express.Router();

router.post("/message", chatbotController.processMessage);

export default router;
