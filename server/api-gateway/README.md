require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const helmet = require("helmet");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const HttpException = require("./utils/HttpException.utils");
const errorMiddleware = require("./middleware/error.middleware");
const claimRouter = require("./routes/claim.route");
const policyRouter = require("./routes/policy.route");
const logger = require("./utils/logger.utils");
const proxy = require("express-http-proxy");
const { cacheMiddleware } = require("./middleware/cache");
const authMiddleware = require("./middleware/auth.middleware");
const { connectRedis } = require("./config/redis");
const rabbitMQClient = require("./config/rabbitmq");

const app = express();
const port = Number(process.env.PORT || 3330);
app.set("trust proxy", true);

// Load Swagger API Spec
const apiGatewaySwagger = YAML.load(path.join(__dirname, "swagger.yaml"));
const insuranceSwagger = YAML.load(
  path.join(__dirname, "../../insurance-service/src/swagger.yaml")
);
const authSwagger = YAML.load(
  path.join(__dirname, "../../auth-service/src/swagger.yaml")
);

// Combine Swagger Docs (you can adjust this depending on your needs)
const combinedSwagger = {
  openapi: "3.0.0",
  info: apiGatewaySwagger.info,
  servers: [
    ...apiGatewaySwagger.servers,
    ...authSwagger.servers,
    ...insuranceSwagger.servers,
  ],
  paths: {
    ...apiGatewaySwagger.paths,
    ...authSwagger.paths,
    ...insuranceSwagger.paths,
  },
  components: {
    ...apiGatewaySwagger.components,
    schemas: {
      ...apiGatewaySwagger.components.schemas,
      ...authSwagger.components.schemas,
      ...insuranceSwagger.components.schemas,
    },
    securitySchemes: {
      ...apiGatewaySwagger.components.securitySchemes,
      ...authSwagger.components.securitySchemes,
      ...insuranceSwagger.components.securitySchemes,
    },
  },
  security: [{ bearerAuth: [] }],
};

// Security middleware
app.use(helmet());
app.use(cors());
app.options("*", cors());

// Configure custom logger middleware
app.use(logger.dev, logger.combined);

// Body parsing middleware
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Serve static files
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// API Routes
app.use("/api/claim", claimRouter);
app.use("/api/policy", policyRouter);

// Proxy configuration using express-http-proxy
const API_INSURANCE_URL =
  process.env.API_INSURANCE_URL || "http://localhost:3002";
const API_AUTH_URL = process.env.API_AUTH_URL || "http://localhost:3001";

app.use(
  "/api/claim",
  authMiddleware,
  proxy(API_INSURANCE_URL, {
    proxyReqPathResolver: (req) => req.originalUrl,
  })
);
app.use(
  "/api/auth",
  proxy(API_AUTH_URL, {
    proxyReqPathResolver: (req) => req.originalUrl,
  })
);

// Swagger API Documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(combinedSwagger));

// Handle undefined routes
app.all("*", (req, res, next) => {
  next(new HttpException(404, "Endpoint Not Found"));
});

// Error middleware
app.use(errorMiddleware);

// Initialize database and start server
const startServer = async () => {
  try {
    // await connectRedis();
    await rabbitMQClient.connect(); // Initialize RabbitMQ connection
    app.listen(port, () =>
      console.log(`🚀 Server running on http://localhost:${port}`)
    );
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();

// Graceful shutdown
process.on("SIGINT", () => {
  console.log("Shutting down server...");
  process.exit();
});
process.on("SIGTERM", () => {
  console.log("Process terminated.");
  process.exit();
});
