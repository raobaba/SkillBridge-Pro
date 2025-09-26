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

    if (!status.hasRunMigrations) {
      console.log(`ℹ️ No migrations to rollback for ${serviceName}`);
      process.exit(0);
    }

    // Confirm rollback
    console.log(`⚠️ WARNING: This will rollback your database to the last backup for ${serviceName}!`);
    console.log(`📋 Applied migrations:`, status.migrations.map(m => m.hash).join(', '));
    
    // In production, you might want to add a confirmation prompt
    if (process.env.NODE_ENV === 'production') {
      console.log(`🚫 Rollback blocked in production environment for ${serviceName}`);
      console.log("💡 To force rollback, set FORCE_ROLLBACK=true");
      if (process.env.FORCE_ROLLBACK !== 'true') {
        process.exit(1);
      }
    }

    // Perform rollback
    const success = await migrationManager.rollback();
    
    if (success) {
      console.log(`🎉 Rollback completed successfully for ${serviceName}!`);
    } else {
      console.log(`⚠️ Rollback completed with warnings for ${serviceName}`);
    }
    
    process.exit(0);
  } catch (error) {
    console.error(`💥 Rollback process failed for ${serviceName}:`, error.message);
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
