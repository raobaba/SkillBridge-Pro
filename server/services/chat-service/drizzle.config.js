require("dotenv").config();

module.exports = {
  schema: "./src/models/index.js",
  out: "./src/db/migrations",
  dialect: "postgresql",
  dbCredentials: process.env.DATABASE_URL
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
      }
    : {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT || 5432,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : false,
      },
  verbose: process.env.DB_LOGGING === "true",
  strict: true,
};

