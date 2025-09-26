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
    console.log(`📊 Current migration status for ${serviceName}:`, status);

    // Run migrations
    await migrationManager.runMigrations();
    
    console.log(`🎉 All migrations completed successfully for ${serviceName}!`);
    process.exit(0);
  } catch (error) {
    console.error(`💥 Migration process failed for ${serviceName}:`, error.message);
    process.exit(1);
  } finally {
    await migrationManager.close();
  }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Received SIGINT, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Received SIGTERM, shutting down gracefully...');
  process.exit(0);
});

main();
