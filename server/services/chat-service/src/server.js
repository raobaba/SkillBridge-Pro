require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const session = require("express-session");
const fileUpload = require("express-fileupload");
const errorMiddleware = require("shared/middleware/error.middleware");
const logger = require("shared/utils/logger.utils");
const { initializeDatabase } = require("./config/database");
const chatRouter = require("./routes/chat.routes");

const app = express();
const PORT = process.env.PORT || 3004;

// 🔐 Core Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET || "default_secret",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(
  fileUpload({
    useTempFiles: true,
  })
);

// 📦 Logging Middleware
app.use(logger.dev, logger.combined);

// 📂 Route Mounting
app.use("/api/v1/chat", chatRouter);

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    status: 200,
    message: "Chat Service is running",
    timestamp: new Date().toISOString(),
  });
});

// ⚠️ Error Middleware
app.use(errorMiddleware);

// 🚀 Start Server
const startServer = async () => {
  try {
    await initializeDatabase();
    app.listen(PORT, () =>
      console.log(`🚀 Chat Service running on http://localhost:${PORT}`)
    );
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();

