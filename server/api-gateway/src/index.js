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
const projectSwagger = YAML.load(
  path.join(__dirname, "swagger", "project.swagger.yaml")
);
// Optional: settings swagger (if present)
let settingsSwagger = { servers: [], tags: [], paths: {}, components: {} };
try {
  settingsSwagger = YAML.load(
    path.join(__dirname, "swagger", "settings.swagger.yaml")
  );
} catch (e) {
  // settings swagger not present yet; proceed without it
}

// Combine Swagger docs
const combinedSwagger = {
  openapi: "3.0.0",
  info: {
    title: "SkillBridge API Gateway",
    version: "1.0.0",
    description: "Unified API documentation for all microservices",
  },
  servers: [...apiGatewaySwagger.servers, ...userSwagger.servers, ...projectSwagger.servers, ...(settingsSwagger.servers || [])],
  tags: [
    ...(apiGatewaySwagger.tags || []),
    ...(userSwagger.tags || []),
    ...(projectSwagger.tags || []),
    ...(settingsSwagger.tags || [])
  ],
  paths: { 
    ...apiGatewaySwagger.paths, 
    ...userSwagger.paths, 
    ...projectSwagger.paths,
    ...(settingsSwagger.paths || {})
  },
  components: {
    schemas: {
      ...(apiGatewaySwagger.components?.schemas || {}),
      ...(userSwagger.components?.schemas || {}),
      ...(projectSwagger.components?.schemas || {}),
      ...(settingsSwagger.components?.schemas || {}),
    },
    securitySchemes: {
      ...(apiGatewaySwagger.components?.securitySchemes || {}),
      ...(userSwagger.components?.securitySchemes || {}),
      ...(projectSwagger.components?.securitySchemes || {}),
      ...(settingsSwagger.components?.securitySchemes || {}),
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

const API_PROJECT_URL = process.env.API_PROJECT_URL || "http://localhost:3002";
const API_SETTINGS_URL = process.env.API_SETTINGS_URL || "http://localhost:3003";

// Mount proxy at root `/` and forward full original path to user-service
app.use(
  "/api/v1/user",
  proxy(API_USER_URL, {
    proxyReqPathResolver: (req) => req.originalUrl,
    limit: "50mb",
    parseReqBody: true,
    proxyReqBodyDecorator: (bodyContent, srcReq) => bodyContent,
    proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
      // Forward all headers including Authorization
      proxyReqOpts.headers = { ...proxyReqOpts.headers, ...srcReq.headers };
      return proxyReqOpts;
    },
    userResDecorator: async (proxyRes, proxyResData) => proxyResData.toString("utf8"),
    onError: (err, req, res) => {
      res.status(500).json({ message: "Proxy error", error: err.message });
    },
  })
);

app.use(
  "/api/v1/auth",
  proxy(API_USER_URL, {
    proxyReqPathResolver: (req) => req.originalUrl,
    limit: "50mb",
    parseReqBody: true,
    proxyReqBodyDecorator: (bodyContent, srcReq) => bodyContent,
    proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
      // Forward all headers including Authorization
      proxyReqOpts.headers = { ...proxyReqOpts.headers, ...srcReq.headers };
      return proxyReqOpts;
    },
    userResDecorator: async (proxyRes, proxyResData) =>
      proxyResData.toString("utf8"),
    onError: (err, req, res) => {
      res.status(500).json({ message: "Proxy error", error: err.message });
    },
  })
);

app.use(
  "/api/v1/projects",
  proxy(API_PROJECT_URL, {
    proxyReqPathResolver: (req) => req.originalUrl,
    limit: "50mb",
    parseReqBody: true,
    proxyReqBodyDecorator: (bodyContent, srcReq) => bodyContent,
    proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
      // Forward all headers including Authorization
      proxyReqOpts.headers = { ...proxyReqOpts.headers, ...srcReq.headers };
      return proxyReqOpts;
    },
    userResDecorator: async (proxyRes, proxyResData) =>
      proxyResData.toString("utf8"),
    onError: (err, req, res) => {
      res.status(500).json({ message: "Proxy error", error: err.message });
    },
  })
);

app.use(
  "/api/v1/settings",
  proxy(API_SETTINGS_URL, {
    proxyReqPathResolver: (req) => req.originalUrl,
    limit: "50mb",
    parseReqBody: true,
    proxyReqBodyDecorator: (bodyContent, srcReq) => bodyContent,
    proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
      // Forward all headers including Authorization
      proxyReqOpts.headers = { ...proxyReqOpts.headers, ...srcReq.headers };
      return proxyReqOpts;
    },
    userResDecorator: async (proxyRes, proxyResData) =>
      proxyResData.toString("utf8"),
    onError: (err, req, res) => {
      res.status(500).json({ message: "Proxy error", error: err.message });
    },
  })
);


// Error middleware must be after proxy
app.use(errorMiddleware);


// Serve Swagger JSON
app.get("/api-docs/swagger.json", (req, res) => {
  res.json(combinedSwagger);
});

// Swagger UI with automatic token capture
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(combinedSwagger, {
  customCss: `
    .swagger-ui .topbar { display: none; }
    .auth-status-bar {
      background: #f8f9fa;
      border-bottom: 1px solid #e9ecef;
      padding: 10px 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-family: Arial, sans-serif;
    }
    .auth-status {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .auth-indicator {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: #dc3545;
    }
    .auth-indicator.authenticated {
      background: #28a745;
    }
    .logout-btn {
      background: #dc3545;
      color: white;
      border: none;
      padding: 6px 12px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 12px;
    }
    .logout-btn:hover {
      background: #c82333;
    }
  `,
  customSiteTitle: "SkillBridge API Documentation",
  swaggerOptions: {
    persistAuthorization: true, // Persist authorization across page refreshes
    displayRequestDuration: true,
    docExpansion: 'none',
    filter: true,
    showExtensions: true,
    showCommonExtensions: true,
    tryItOutEnabled: true,
    onComplete: () => {
      // Define auth status functions
      function updateAuthStatus() {
        const token = localStorage.getItem('swagger-token');
        const indicator = document.getElementById('auth-indicator');
        const text = document.getElementById('auth-text');
        
        if (token) {
          if (indicator) indicator.className = 'auth-indicator authenticated';
          if (text) text.textContent = 'Authenticated';
        } else {
          if (indicator) indicator.className = 'auth-indicator';
          if (text) text.textContent = 'Not authenticated';
        }
      }
      
      function manualLogout() {
        localStorage.removeItem('swagger-token');
        updateAuthStatus();
        
        // Show logout message
        const logoutDiv = document.createElement('div');
        logoutDiv.style.cssText = `
          position: fixed;
          top: 20px;
          right: 20px;
          background: #ff6b6b;
          color: white;
          padding: 15px 20px;
          border-radius: 5px;
          z-index: 9999;
          font-family: Arial, sans-serif;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        `;
        logoutDiv.innerHTML = '🚪 Manual logout successful! Token cleared.';
        document.body.appendChild(logoutDiv);
        
        // Remove message after 3 seconds
        setTimeout(() => {
          if (logoutDiv.parentNode) {
            logoutDiv.parentNode.removeChild(logoutDiv);
          }
        }, 3000);
        
        console.log('✅ Manual logout - Token cleared');
      }
      
      // Add custom auth status bar
      const authBar = document.createElement('div');
      authBar.className = 'auth-status-bar';
      authBar.innerHTML = `
        <div class="auth-status">
          <div class="auth-indicator" id="auth-indicator"></div>
          <span id="auth-text">Not authenticated</span>
        </div>
        <button class="logout-btn" onclick="manualLogout()">Logout</button>
      `;
      
      // Insert at the top of the page
      const swaggerContainer = document.querySelector('.swagger-ui');
      if (swaggerContainer) {
        swaggerContainer.insertBefore(authBar, swaggerContainer.firstChild);
      }
      
      // Update auth status
      updateAuthStatus();
      
      // Check auth status every 2 seconds
      setInterval(updateAuthStatus, 2000);
      
      // Define global functions
      window.updateAuthStatus = updateAuthStatus;
      window.manualLogout = manualLogout;
    },
    requestInterceptor: (req) => {
      // Auto-inject token if available
      const token = localStorage.getItem('swagger-token');
      if (token) {
        req.headers.Authorization = `Bearer ${token}`;
      }
      return req;
    },
    responseInterceptor: (res) => {
      // Auto-save token from login response
      if (res.url && res.url.includes('/api/v1/user/login') && res.status === 200) {
        try {
          const responseData = JSON.parse(res.body);
          if (responseData.token) {
            localStorage.setItem('swagger-token', responseData.token);
            console.log('✅ Token automatically saved from login response');
            
            // Show success message
            setTimeout(() => {
              const successDiv = document.createElement('div');
              successDiv.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: #4CAF50;
                color: white;
                padding: 15px 20px;
                border-radius: 5px;
                z-index: 9999;
                font-family: Arial, sans-serif;
                box-shadow: 0 4px 6px rgba(0,0,0,0.1);
              `;
              successDiv.innerHTML = '✅ Login successful! Token automatically saved. All API calls are now authorized.';
              document.body.appendChild(successDiv);
              
              // Remove message after 5 seconds
              setTimeout(() => {
                if (successDiv.parentNode) {
                  successDiv.parentNode.removeChild(successDiv);
                }
              }, 5000);
            }, 100);
          }
        } catch (e) {
          console.log('Could not parse login response');
        }
      }
      
      // Auto-clear token from logout response
      if (res.url && res.url.includes('/api/v1/user/logout') && res.status === 200) {
        try {
          const responseData = JSON.parse(res.body);
          if (responseData.success) {
            localStorage.removeItem('swagger-token');
            console.log('✅ Token automatically cleared from logout response');
            
            // Show logout message
            setTimeout(() => {
              const logoutDiv = document.createElement('div');
              logoutDiv.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: #ff6b6b;
                color: white;
                padding: 15px 20px;
                border-radius: 5px;
                z-index: 9999;
                font-family: Arial, sans-serif;
                box-shadow: 0 4px 6px rgba(0,0,0,0.1);
              `;
              logoutDiv.innerHTML = '🚪 Logout successful! Token cleared. You are now logged out.';
              document.body.appendChild(logoutDiv);
              
              // Remove message after 5 seconds
              setTimeout(() => {
                if (logoutDiv.parentNode) {
                  logoutDiv.parentNode.removeChild(logoutDiv);
                }
              }, 5000);
            }, 100);
          }
        } catch (e) {
          console.log('Could not parse logout response');
        }
      }
      
      return res;
    }
  }
}));

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
