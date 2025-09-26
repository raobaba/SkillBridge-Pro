const { drizzle } = require("drizzle-orm/node-postgres");
const { Pool } = require("pg");
const { migrate } = require("drizzle-orm/node-postgres/migrator");
const fs = require("fs").promises;
const path = require("path");
require("dotenv").config();

class MigrationManager {
  constructor(options = {}) {
    this.pool = null;
    this.db = null;
    this.migrationsFolder = options.migrationsFolder || "./src/db/migrations";
    this.backupFolder = options.backupFolder || "./src/db/backups";
    this.serviceName = options.serviceName || "service";
  }

  async initialize() {
    try {
      // Create backup folder if it doesn't exist
      await this.ensureBackupFolder();
      
      // Initialize database connection
      await this.createConnection();
      
      console.log(`✅ Migration manager initialized successfully for ${this.serviceName}`);
      return true;
    } catch (error) {
      console.error(`❌ Failed to initialize migration manager for ${this.serviceName}:`, error);
      return false;
    }
  }

  async createConnection() {
    const dbConfig = process.env.DATABASE_URL
      ? {
          connectionString: process.env.DATABASE_URL,
          ssl: { rejectUnauthorized: false },
          max: Number(process.env.DB_POOL_MAX) || 20,
        }
      : {
          host: process.env.DB_HOST || "localhost",
          port: Number(process.env.DB_PORT) || 5432,
          user: process.env.DB_USER || "postgres",
          password: process.env.DB_PASSWORD,
          database: process.env.DB_NAME || "skillbridge_db",
          ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : false,
          max: Number(process.env.DB_POOL_MAX) || 20,
        };

    this.pool = new Pool(dbConfig);
    this.db = drizzle(this.pool, {
      logger: process.env.DB_LOGGING === "true",
    });

    // Test connection
    const client = await this.pool.connect();
    client.release();
    console.log(`🔗 Database connection established for ${this.serviceName}`);
  }

  async ensureBackupFolder() {
    try {
      await fs.access(this.backupFolder);
    } catch {
      await fs.mkdir(this.backupFolder, { recursive: true });
      console.log(`📁 Created backup folder for ${this.serviceName}`);
    }
  }

  async createBackup() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFile = path.join(this.backupFolder, `backup-${this.serviceName}-${timestamp}.sql`);
    
    try {
      const client = await this.pool.connect();
      
      // Get all table names
      const tablesResult = await client.query(`
        SELECT tablename FROM pg_tables 
        WHERE schemaname = 'public' 
        ORDER BY tablename;
      `);
      
      let backupSQL = `-- Database backup created at ${new Date().toISOString()} for ${this.serviceName}\n\n`;
      
      // Backup each table
      for (const table of tablesResult.rows) {
        const tableName = table.tablename;
        
        // Get table structure
        const structureResult = await client.query(`
          SELECT column_name, data_type, is_nullable, column_default
          FROM information_schema.columns 
          WHERE table_name = $1 AND table_schema = 'public'
          ORDER BY ordinal_position;
        `, [tableName]);
        
        backupSQL += `-- Table: ${tableName}\n`;
        backupSQL += `CREATE TABLE IF NOT EXISTS "${tableName}" (\n`;
        
        const columns = structureResult.rows.map(col => {
          let def = `  "${col.column_name}" ${col.data_type}`;
          if (col.is_nullable === 'NO') def += ' NOT NULL';
          if (col.column_default) def += ` DEFAULT ${col.column_default}`;
          return def;
        }).join(',\n');
        
        backupSQL += columns + '\n);\n\n';
        
        // Get table data
        const dataResult = await client.query(`SELECT * FROM "${tableName}"`);
        if (dataResult.rows.length > 0) {
          backupSQL += `-- Data for ${tableName}\n`;
          for (const row of dataResult.rows) {
            const values = Object.values(row).map(val => 
              val === null ? 'NULL' : `'${String(val).replace(/'/g, "''")}'`
            ).join(', ');
            backupSQL += `INSERT INTO "${tableName}" VALUES (${values});\n`;
          }
          backupSQL += '\n';
        }
      }
      
      client.release();
      
      await fs.writeFile(backupFile, backupSQL);
      console.log(`💾 Backup created for ${this.serviceName}: ${backupFile}`);
      return backupFile;
    } catch (error) {
      console.error(`❌ Backup creation failed for ${this.serviceName}:`, error);
      throw error;
    }
  }

  async runMigrations() {
    try {
      console.log(`🚀 Starting database migrations for ${this.serviceName}...`);
      
      // Create backup before migration
      await this.createBackup();
      
      // Run migrations
      await migrate(this.db, { migrationsFolder: this.migrationsFolder });
      
      console.log(`✅ Database migrations completed successfully for ${this.serviceName}`);
      return true;
    } catch (error) {
      console.error(`❌ Migration failed for ${this.serviceName}:`, error);
      
      // Attempt rollback
      console.log(`🔄 Attempting rollback for ${this.serviceName}...`);
      await this.rollback();
      
      throw error;
    }
  }

  async rollback() {
    try {
      // Get the latest backup
      const backupFiles = await fs.readdir(this.backupFolder);
      const latestBackup = backupFiles
        .filter(file => file.startsWith(`backup-${this.serviceName}-`) && file.endsWith('.sql'))
        .sort()
        .pop();
      
      if (!latestBackup) {
        console.log(`⚠️ No backup found for rollback of ${this.serviceName}`);
        return false;
      }
      
      const backupPath = path.join(this.backupFolder, latestBackup);
      const backupSQL = await fs.readFile(backupPath, 'utf8');
      
      console.log(`🔄 Rolling back ${this.serviceName} using: ${latestBackup}`);
      
      const client = await this.pool.connect();
      
      // Drop all tables first
      const tablesResult = await client.query(`
        SELECT tablename FROM pg_tables 
        WHERE schemaname = 'public' 
        ORDER BY tablename;
      `);
      
      for (const table of tablesResult.rows) {
        await client.query(`DROP TABLE IF EXISTS "${table.tablename}" CASCADE;`);
      }
      
      // Restore from backup
      await client.query(backupSQL);
      
      client.release();
      
      console.log(`✅ Rollback completed successfully for ${this.serviceName}`);
      return true;
    } catch (error) {
      console.error(`❌ Rollback failed for ${this.serviceName}:`, error);
      throw error;
    }
  }

  async checkMigrationStatus() {
    try {
      const client = await this.pool.connect();
      
      // Check if __drizzle_migrations table exists
      const tableExists = await client.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'drizzle' 
          AND table_name = '__drizzle_migrations'
        );
      `);
      
      if (!tableExists.rows[0].exists) {
        console.log(`📋 No migrations have been run yet for ${this.serviceName}`);
        client.release();
        return { hasRunMigrations: false, migrations: [] };
      }
      
      // Get applied migrations
      const migrations = await client.query(`
        SELECT * FROM "drizzle"."__drizzle_migrations" 
        ORDER BY id;
      `);
      
      client.release();
      
      console.log(`📋 Found ${migrations.rows.length} applied migrations for ${this.serviceName}`);
      return { 
        hasRunMigrations: true, 
        migrations: migrations.rows 
      };
    } catch (error) {
      console.error(`❌ Failed to check migration status for ${this.serviceName}:`, error);
      throw error;
    }
  }

  async close() {
    if (this.pool) {
      await this.pool.end();
      // Connection closed silently - no confusing message for developers
    }
  }
}

module.exports = MigrationManager;
