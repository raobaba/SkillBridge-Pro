const { drizzle } = require("drizzle-orm/node-postgres");
const { Pool } = require("pg");
const { migrate } = require("drizzle-orm/node-postgres/migrator");
require("dotenv").config();

const dbConfig = {
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 5432,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : false,
  max: Number(process.env.DB_POOL_MAX) || 20,
  idleTimeoutMillis: Number(process.env.DB_POOL_IDLE_TIMEOUT) || 30000,
  connectionTimeoutMillis: Number(process.env.DB_POOL_CONNECTION_TIMEOUT) || 10000,
};


const createPool = () => {
  const pool = new Pool(dbConfig);

  pool.on("error", (err) => {
    console.error("Unexpected error on idle client", err);
    if (err.code === "ETIMEDOUT" || err.code === "PROTOCOL_CONNECTION_LOST") {
      console.log("Attempting to reconnect...");
      setTimeout(createPool, 3000);
    }
  });

  return pool;
};

const pool = createPool();
const db = drizzle(pool, {
  logger: process.env.DB_LOGGING === "true",
});


const testConnection = async () => {
  try {
    const client = await pool.connect();
    console.log("🚀 Database connected successfully!");
    client.release();
    return true;
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    return false;
  }
};

const runMigrations = async () => {
  try {
    await migrate(db, { migrationsFolder: "./src/db/migrations" });
    console.log("✅ Database migrations completed successfully");
  } catch (error) {
    console.error("❌ Database migrations failed:", error);
    throw error;
  }
};

const initializeDatabase = async () => {
  const isConnected = await testConnection();
  if (isConnected) {
    await runMigrations();
  }
};

const closeConnection = async () => {
  console.log("🔴 Closing database connection...");
  await pool.end();
  console.log("✅ Database connection closed.");
};

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
