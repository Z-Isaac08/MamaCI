import express from "express";
import cors from "cors";
import profileRoutes from "./routes/profileRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import adviceRoutes from "./routes/adviceRoutes.js";
import chatbotRoutes from "./routes/chatbotRoutes.js";
import ussdRoutes from "./routes/ussdRoutes.js";
import { responseFormatter, globalErrorHandler } from "./middlewares/responseHandler.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(responseFormatter);

// Routes
app.use("/api/profiles", profileRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/advice", adviceRoutes);
app.use("/api/chatbot", chatbotRoutes);
app.use("/api/ussd", ussdRoutes);

// Health check
app.get("/health", (req, res) => {
  res.success({ status: "running" });
});

// Error handling middleware
app.use(globalErrorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
