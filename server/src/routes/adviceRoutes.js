import express from "express";
import * as adviceController from "../controllers/adviceController.js";

const router = express.Router();

router.get("/", adviceController.getAdvice);

export default router;
