const express = require("express");
require("dotenv").config();
const cors = require("cors");
const path = require("path");
const helmet = require("helmet");
const YAML = require("yamljs");
const cookieParser = require("cookie-parser");
const authMiddleware = require("./middlewares/auth.js");
const proxy = require("express-http-proxy");
const Connection = require("./config/db");
const swaggerUi = require("swagger-ui-express");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Load Swagger API Spec
const apiGatewaySwagger = YAML.load(path.join(__dirname, "swagger.yaml"));
const applicationSwagger = YAML.load(
  path.join(__dirname, "../../application-service/src/swagger.yaml")
);
const companySwagger = YAML.load(
  path.join(__dirname, "../../company-service/src/swagger.yaml")
);
const jobSwagger = YAML.load(
  path.join(__dirname, "../../job-service/src/swagger.yaml")
);
const userSwagger = YAML.load(
  path.join(__dirname, "../../user-service/src/swagger.yaml")
);

// Combine Swagger Docs
const combinedSwagger = {
  openapi: "3.0.0",
  info: apiGatewaySwagger.info,
  servers: [
    ...apiGatewaySwagger.servers,
    ...userSwagger.servers,
    ...jobSwagger.servers,
    ...applicationSwagger.servers,
    ...companySwagger.servers,
  ],
  paths: {
    ...apiGatewaySwagger.paths,
    ...userSwagger.paths,
    ...jobSwagger.paths,
    ...applicationSwagger.paths,
    ...companySwagger.paths,
  },
  components: {
    schemas: {
      ...apiGatewaySwagger.components?.schemas,
      ...userSwagger.components?.schemas,
      ...jobSwagger.components?.schemas,
      ...applicationSwagger.components?.schemas,
      ...companySwagger.components?.schemas,
    },
    securitySchemes: {
      ...apiGatewaySwagger.components?.securitySchemes,
      ...userSwagger.components?.securitySchemes,
      ...jobSwagger.components?.securitySchemes,
      ...applicationSwagger.components?.securitySchemes,
      ...companySwagger.components?.securitySchemes,
    },
  },
  security: [{ bearerAuth: [] }],
};

// Swagger API Documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(combinedSwagger));

app.use(helmet());

app.use(cors());

Connection();

// Proxy configuration using express-http-proxy

app.use(
  "/api/v1/user",
  authMiddleware,
  proxy(process.env.API_AUTH_URL, {
    proxyReqPathResolver: (req) => req.originalUrl,
  })
);
app.use(
  "/api/v1/company",
  authMiddleware,
  proxy(process.env.API_COMPANY_URL, {
    proxyReqPathResolver: (req) => req.originalUrl,
  })
);

app.use(
  "/api/v1/job",
  authMiddleware,
  proxy(process.env.API_JOB_URL, {
    proxyReqPathResolver: (req) => req.originalUrl,
  })
);

app.use(
  "/api/v1/application",
  authMiddleware,
  proxy(process.env.API_APPLICATION_URL, {
    proxyReqPathResolver: (req) => req.originalUrl,
  })
);

console.log(app.listenerCount("connection"));
app.get("/", (req, res) => {
  res.send("Server is Running! 🚀");
});

module.exports = app;
