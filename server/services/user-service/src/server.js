require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const session = require("express-session");
const passport = require("passport");
const HttpException = require("./utils/HttpException.utils");
const errorMiddleware = require("./middleware/error.middleware");
const logger = require("./utils/logger.utils");
const { initializeDatabase } = require("./config/database");

const userRouter = require('./routes/user.route');
const authRouter = require('./routes/auth.route');
require("./config/passport"); 

const app = express();
const PORT = process.env.PORT || 3001;

// 🔐 Core Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET || 'default_secret',
  resave: false,
  saveUninitialized: true,
}));

// 🧠 Passport Setup
app.use(passport.initialize());
app.use(passport.session());

// 📦 Logging Middleware
app.use(logger.dev, logger.combined);

// 📂 Route Mounting
app.use('/api/v1/user', userRouter);
app.use('/api/v1/auth', authRouter);

// ❌ Handle Undefined Routes (Optional)
// app.all("*", (req, res, next) => {
//   next(new HttpException(404, "Endpoint Not Found"));
// });

// ⚠️ Error Middleware
app.use(errorMiddleware);

// 🚀 Start Server
const startServer = async () => {
  try {
    await initializeDatabase();
    app.listen(PORT, () =>
      console.log(`🚀 User Service running on http://localhost:${PORT}`)
    );
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
