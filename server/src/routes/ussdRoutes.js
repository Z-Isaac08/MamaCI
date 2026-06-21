import express from "express";
import * as ussdController from "../controllers/ussdController.js";

const router = express.Router();

// L'endpoint USSD classique utilise souvent POST
router.post("/", ussdController.processUssd);

export default router;
