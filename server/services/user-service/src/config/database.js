const { drizzle } = require("drizzle-orm/node-postgres");
const { Pool } = require("pg");
const { migrate } = require("drizzle-orm/node-postgres/migrator");
require("dotenv").config();

let pool;

// Prefer DATABASE_URL if present, fallback to individual vars
const dbConfig = process.env.DATABASE_URL
  ? {
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
      max: Number(process.env.DB_POOL_MAX) || 20,
      idleTimeoutMillis: Number(process.env.DB_POOL_IDLE_TIMEOUT) || 30000,
      connectionTimeoutMillis:
        Number(process.env.DB_POOL_CONNECTION_TIMEOUT) || 20000, // bumped to 20s
      keepAlive: true,
    }
  : {
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT) || 5432,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      ssl:
        process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : false,
      max: Number(process.env.DB_POOL_MAX) || 20,
      idleTimeoutMillis: Number(process.env.DB_POOL_IDLE_TIMEOUT) || 30000,
      connectionTimeoutMillis:
        Number(process.env.DB_POOL_CONNECTION_TIMEOUT) || 20000,
      keepAlive: true,
    };

const createPool = () => {
  pool = new Pool(dbConfig);

  pool.on("error", (err) => {
    console.error("❌ Unexpected error on idle client:", err);

    if (
      err.code === "ETIMEDOUT" ||
      err.code === "PROTOCOL_CONNECTION_LOST" ||
      err.code === "ECONNRESET"
    ) {
      console.log("⚠️ Lost DB connection. Attempting to reconnect...");
      reconnectPool();
    }
  });

  return pool;
};

const reconnectPool = (retries = 5, delay = 3000) => {
  let attempts = 0;

  const tryReconnect = async () => {
    if (attempts >= retries) {
      console.error("❌ Failed to reconnect to DB after max retries.");
      return;
    }

    try {
      pool = createPool();
      const client = await pool.connect();
      client.release();
      console.log("✅ Reconnected to DB successfully!");
    } catch (err) {
      attempts++;
      console.error(`Reconnect attempt ${attempts} failed:`, err.message);
      setTimeout(tryReconnect, delay);
    }
  };

  tryReconnect();
};

// Initialize Pool + Drizzle
createPool();
const db = drizzle(pool, {
  logger: process.env.DB_LOGGING === "true",
});

const testConnection = async (retries = 3, delay = 2000) => {
  for (let i = 0; i < retries; i++) {
    try {
      const client = await pool.connect();
      console.log("🚀 Database connected successfully for user-service!");
      client.release();
      return true;
    } catch (error) {
      console.error(
        `❌ DB connection failed (Attempt ${i + 1}/${retries}):`,
        error.message
      );
      if (i < retries - 1) {
        await new Promise((res) => setTimeout(res, delay));
        console.log("🔄 Retrying DB connection...");
      }
    }
  }
  return false;
};

const runMigrations = async () => {
  try {
    const path = require("path");
    const migrationPath = path.resolve(__dirname, "../../../../shared/migration");
    const { runMigrations } = require(migrationPath);
    
    // Suppress detailed migration output for cleaner startup
    const originalConsoleLog = console.log;
    console.log = () => {}; // Suppress migration details
    
    await runMigrations("user-service", {
      migrationsFolder: "./src/db/migrations",
      backupFolder: "./src/db/backups"
    });
    
    console.log = originalConsoleLog; // Restore console.log
    console.log("✅ Database migrations completed successfully for user-service");
  } catch (error) {
    console.error("❌ Database migrations failed:", error);
    throw error;
  }
};

const initializeDatabase = async () => {
  const isConnected = await testConnection();
  if (isConnected) {
    await runMigrations();
  } else {
    console.error("🚫 Could not initialize DB. Check connection settings.");
  }
};

const closeConnection = async () => {
  console.log("🔴 Closing database connection...");
  if (pool) {
    await pool.end();
    console.log("✅ Database connection closed.");
  }
};

// 🔥 Keep-alive ping (to prevent Neon free-tier idle disconnects)
setInterval(async () => {
  if (!pool) return;
  try {
    await pool.query("SELECT 1");
    console.log("🟢 DB keep-alive ping");
  } catch (err) {
    console.error("⚠️ Keep-alive ping failed:", err.message);
  }
}, 5 * 60 * 1000); // every 5 minutes

process.on("SIGINT", async () => {
  await closeConnection();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await closeConnection();
  process.exit(0);
});

module.exports = {
  db,
  pool,
  initializeDatabase,
};
