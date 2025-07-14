const { drizzle } = require("drizzle-orm/node-postgres");
const { migrate } = require("drizzle-orm/node-postgres/migrator");
const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || "backend_db",
});

const db = drizzle(pool);

async function main() {
  console.log("Migration started...");
  await migrate(db, { migrationsFolder: "./src/db/migrations" });
  console.log("Migration completed!");
  process.exit(0);
}

main().catch((err) => {
  console.error("Migration failed!");
  console.error(err);
  process.exit(1);
});
