require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const helmet = require("helmet");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const proxy = require("express-http-proxy");
const logger = require("./utils/logger.utils");
const errorMiddleware = require("./middlewares/error.middleware");
const rabbitMQClient = require("./config/rabbitmq");

const app = express();
const port = Number(process.env.PORT || 3000);

// Load Swagger YAML files
const apiGatewaySwagger = YAML.load(
  path.join(__dirname, "swagger", "gateway.swagger.yaml")
);
const userSwagger = YAML.load(
  path.join(__dirname, "swagger", "user.swagger.yaml")
);

// Combine Swagger docs
const combinedSwagger = {
  openapi: "3.0.0",
  info: {
    title: "SkillBridge API Gateway",
    version: "1.0.0",
    description: "Unified API documentation for all microservices",
  },
  servers: [...apiGatewaySwagger.servers, ...userSwagger.servers],
  paths: { ...apiGatewaySwagger.paths, ...userSwagger.paths },
  components: {
    schemas: {
      ...(apiGatewaySwagger.components?.schemas || {}),
      ...(userSwagger.components?.schemas || {}),
    },
    securitySchemes: {
      ...(apiGatewaySwagger.components?.securitySchemes || {}),
      ...(userSwagger.components?.securitySchemes || {}),
    },
  },
  security: [{ bearerAuth: [] }],
};

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Logging middleware
app.use(logger.dev, logger.combined);

// Static files
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Proxy configuration
const API_USER_URL = process.env.API_USER_URL || "http://localhost:3001";

// Mount proxy at root `/` and forward full original path to user-service
app.use(
  "/api/v1/users",
  proxy(API_USER_URL, {
    proxyReqPathResolver: (req) => req.originalUrl,
    limit: "50mb",
    parseReqBody: true,
    proxyReqBodyDecorator: (bodyContent, srcReq) => bodyContent,
    userResDecorator: async (proxyRes, proxyResData) => proxyResData.toString("utf8"),
    onError: (err, req, res) => {
      res.status(500).json({ message: "Proxy error", error: err.message });
    },
  })
);


// Error middleware must be after proxy
app.use(errorMiddleware);

// Swagger UI docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(combinedSwagger));

// Start server
const startServer = async () => {
  try {
    await rabbitMQClient.connect();
    app.listen(port, () => {
      console.log(`🚀 API Gateway running at http://localhost:${port}`);
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err);
    process.exit(1);
  }
};

// Graceful shutdown
process.on("SIGINT", () => {
  console.log("🔌 Server shutting down...");
  process.exit();
});
process.on("SIGTERM", () => {
  console.log("💀 Server terminated.");
  process.exit();
});

startServer();
