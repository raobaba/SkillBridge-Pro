// src/config/db.js
import { drizzle } from 'drizzle-orm/node-postgres';
import pkg from 'pg';
import schema from '../models/index.js'; 

const { Pool } = pkg;
let db;

const connectDB = () => {
  const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  db = drizzle(pool, { schema });
  console.log('🗄️ Connected to PostgreSQL using Drizzle ORM');
};

export default connectDB;
export { db };
