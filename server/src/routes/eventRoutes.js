import express from "express";
import * as eventController from "../controllers/eventController.js";

const router = express.Router();

router.patch("/:id/status", eventController.updateStatus);
router.post("/:id/trigger-reminder", eventController.triggerReminder);

export default router;
