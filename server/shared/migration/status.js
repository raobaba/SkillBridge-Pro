const MigrationManager = require("./MigrationManager");

async function main() {
  const serviceName = process.env.SERVICE_NAME || "service";
  const migrationsFolder = process.env.MIGRATIONS_FOLDER || "./src/db/migrations";
  const backupFolder = process.env.BACKUP_FOLDER || "./src/db/backups";
  
  const migrationManager = new MigrationManager({
    serviceName,
    migrationsFolder,
    backupFolder
  });
  
  try {
    // Initialize migration manager
    const initialized = await migrationManager.initialize();
    if (!initialized) {
      console.error(`❌ Failed to initialize migration manager for ${serviceName}`);
      process.exit(1);
    }

    // Check current migration status
    const status = await migrationManager.checkMigrationStatus();
    
    console.log(`\n📊 Database Migration Status for ${serviceName}`);
    console.log("================================");
    
    if (!status.hasRunMigrations) {
      console.log("📋 Status: No migrations have been applied");
      console.log("💡 Run 'npm run db:migrate' to apply migrations");
    } else {
      console.log(`📋 Status: ${status.migrations.length} migrations applied`);
      console.log("\n📝 Applied Migrations:");
      status.migrations.forEach((migration, index) => {
        const date = new Date(parseInt(migration.created_at)).toLocaleString();
        console.log(`  ${index + 1}. ${migration.hash} (${date})`);
      });
    }
    
    // Check for pending migrations
    const fs = require("fs");
    const path = require("path");
    
    try {
      const migrationsDir = migrationsFolder;
      const files = fs.readdirSync(migrationsDir);
      const sqlFiles = files.filter(file => file.endsWith('.sql'));
      
      console.log(`\n📁 Migration Files: ${sqlFiles.length} found`);
      sqlFiles.forEach((file, index) => {
        console.log(`  ${index + 1}. ${file}`);
      });
      
      if (status.hasRunMigrations && sqlFiles.length > status.migrations.length) {
        console.log("\n⚠️ Warning: There are pending migrations to apply");
        console.log("💡 Run 'npm run db:migrate' to apply pending migrations");
      }
    } catch (error) {
      console.log("⚠️ Could not check migration files:", error.message);
    }
    
    process.exit(0);
  } catch (error) {
    console.error(`💥 Status check failed for ${serviceName}:`, error.message);
    process.exit(1);
  } finally {
    await migrationManager.close();
  }
}

main();
