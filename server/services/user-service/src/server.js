// src/server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const HttpException = require("./utils/HttpException.utils");
const errorMiddleware = require("./middleware/error.middleware");
const logger = require("./utils/logger.utils");
const { initializeDatabase } = require("./config/database");
const userRouter = require('./routes/user.route')

const app = express();
const PORT = process.env.PORT || 3001;

app.use(helmet());
app.use(cors());
app.use(express.json());
// Configure custom logger middleware
app.use(logger.dev, logger.combined);
app.use('/api/v1/users', userRouter);

// Handle undefined routes
// app.all("*", (req, res, next) => {
//   next(new HttpException(404, "Endpoint Not Found"));
// });

// Error middleware
app.use(errorMiddleware);
const startServer = async () => {
  try {
    await initializeDatabase();
    app.listen(PORT, () =>
      console.log(`🚀 Server running on http://localhost:${PORT}`)
    );
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
