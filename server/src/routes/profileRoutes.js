import express from "express";
import * as profileController from "../controllers/profileController.js";

const router = express.Router();

router.post("/", profileController.createProfile);
router.get("/:id", profileController.getProfile);
router.patch("/:id/mode", profileController.updateMode);

// Calendar endpoints nested under profile per the docs
router.post("/:id/calendar/generate", profileController.generateCalendar);
router.get("/:id/calendar", profileController.getCalendar);
router.get("/:id/reminders", profileController.getReminders);

export default router;
