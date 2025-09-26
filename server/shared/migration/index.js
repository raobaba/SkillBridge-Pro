const MigrationManager = require("./MigrationManager");

// Export the MigrationManager class and utility functions
module.exports = {
  MigrationManager,
  
  // Utility function to create a migration manager with service-specific config
  createMigrationManager: (serviceName, options = {}) => {
    return new MigrationManager({
      serviceName,
      migrationsFolder: options.migrationsFolder || "./src/db/migrations",
      backupFolder: options.backupFolder || "./src/db/backups",
      ...options
    });
  },
  
  // Utility function to run migrations for a specific service
  runMigrations: async (serviceName, options = {}) => {
    const migrationManager = new MigrationManager({
      serviceName,
      migrationsFolder: options.migrationsFolder || "./src/db/migrations",
      backupFolder: options.backupFolder || "./src/db/backups",
      ...options
    });
    
    try {
      await migrationManager.initialize();
      await migrationManager.runMigrations();
      return true;
    } catch (error) {
      console.error(`Migration failed for ${serviceName}:`, error);
      throw error;
    } finally {
      await migrationManager.close();
    }
  },
  
  // Utility function to check migration status for a specific service
  checkStatus: async (serviceName, options = {}) => {
    const migrationManager = new MigrationManager({
      serviceName,
      migrationsFolder: options.migrationsFolder || "./src/db/migrations",
      backupFolder: options.backupFolder || "./src/db/backups",
      ...options
    });
    
    try {
      await migrationManager.initialize();
      const status = await migrationManager.checkMigrationStatus();
      return status;
    } catch (error) {
      console.error(`Status check failed for ${serviceName}:`, error);
      throw error;
    } finally {
      await migrationManager.close();
    }
  },
  
  // Utility function to rollback migrations for a specific service
  rollback: async (serviceName, options = {}) => {
    const migrationManager = new MigrationManager({
      serviceName,
      migrationsFolder: options.migrationsFolder || "./src/db/migrations",
      backupFolder: options.backupFolder || "./src/db/backups",
      ...options
    });
    
    try {
      await migrationManager.initialize();
      const success = await migrationManager.rollback();
      return success;
    } catch (error) {
      console.error(`Rollback failed for ${serviceName}:`, error);
      throw error;
    } finally {
      await migrationManager.close();
    }
  }
};
