# Shared Migration System

This is a centralized migration system for all SkillBridge Pro microservices. It provides a unified way to manage database migrations across all services.

## Features

- **Centralized Management**: Single migration system for all services
- **Automatic Backups**: Creates backups before each migration
- **Rollback Support**: Safe rollback to previous state
- **Service Isolation**: Each service maintains its own migration history
- **Production Safety**: Built-in production protection

## Usage

### 1. Import the Migration System

```javascript
const { MigrationManager, createMigrationManager } = require("shared/migration");
```

### 2. Create a Migration Manager

```javascript
// Basic usage
const migrationManager = new MigrationManager({
  serviceName: "user-service",
  migrationsFolder: "./src/db/migrations",
  backupFolder: "./src/db/backups"
});

// Or use the utility function
const migrationManager = createMigrationManager("user-service", {
  migrationsFolder: "./src/db/migrations",
  backupFolder: "./src/db/backups"
});
```

### 3. Run Migrations

```javascript
// Initialize and run migrations
await migrationManager.initialize();
await migrationManager.runMigrations();
await migrationManager.close();
```

### 4. Check Status

```javascript
const status = await migrationManager.checkMigrationStatus();
console.log(status);
```

### 5. Rollback

```javascript
const success = await migrationManager.rollback();
```

## Environment Variables

Set these environment variables in your service's `.env` file:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=skillbridge_db
DB_SSL=false

# Alternative: Use DATABASE_URL
# DATABASE_URL=postgresql://username:password@host:port/database

# Service Configuration
SERVICE_NAME=user-service
MIGRATIONS_FOLDER=./src/db/migrations
BACKUP_FOLDER=./src/db/backups

# Database Pool Settings
DB_POOL_MAX=20
DB_POOL_IDLE_TIMEOUT=30000
DB_POOL_CONNECTION_TIMEOUT=20000

# Logging
DB_LOGGING=true
```

## Service Integration

### 1. Update package.json

Add migration scripts to your service's `package.json`:

```json
{
  "scripts": {
    "db:generate": "drizzle-kit generate",
    "db:migrate": "SERVICE_NAME=your-service node ../../shared/migration/migrate.js",
    "db:rollback": "SERVICE_NAME=your-service node ../../shared/migration/rollback.js",
    "db:status": "SERVICE_NAME=your-service node ../../shared/migration/status.js",
    "db:reset": "npm run db:rollback && npm run db:migrate"
  }
}
```

### 2. Programmatic Usage

```javascript
const { runMigrations, checkStatus, rollback } = require("shared/migration");

// Run migrations
await runMigrations("user-service", {
  migrationsFolder: "./src/db/migrations",
  backupFolder: "./src/db/backups"
});

// Check status
const status = await checkStatus("user-service");

// Rollback
const success = await rollback("user-service");
```

## File Structure

Each service should have this structure:

```
your-service/
├── src/
│   └── db/
│       ├── migrations/          # Generated migration files
│       │   ├── 0000_initial.sql
│       │   └── meta/
│       │       ├── _journal.json
│       │       └── 0000_snapshot.json
│       └── backups/             # Automatic backups
├── package.json
└── .env
```

## Migration Workflow

### Development

1. **Make schema changes** in your model files
2. **Generate migration**: `npm run db:generate`
3. **Review the generated migration** in `src/db/migrations/`
4. **Test migration**: `npm run db:migrate`
5. **Verify changes**: `npm run db:status`

### Production

1. **Backup production database** (additional to automatic backup)
2. **Test migration on staging** environment first
3. **Schedule maintenance window** if needed
4. **Run migration**: `npm run db:migrate`
5. **Verify application functionality**
6. **Monitor for issues**

## Safety Features

### Automatic Backup
- Every migration creates an automatic backup
- Backups are stored in `src/db/backups/`
- Backup files are timestamped and service-specific

### Rollback Protection
- Production rollbacks require `FORCE_ROLLBACK=true`
- Automatic rollback on migration failure
- Connection pooling with retry logic

### Error Handling
- Comprehensive error logging
- Graceful shutdown on interruption
- Connection validation before migration

## Best Practices

### 1. Schema Changes
- Always test schema changes in development first
- Use descriptive migration names
- Avoid breaking changes in production
- Consider data migration for large changes

### 2. Migration Management
- Never edit applied migration files
- Always generate new migrations for changes
- Keep migrations small and focused
- Document complex migrations

### 3. Production Safety
- Always backup before production migrations
- Test migrations on staging environment
- Schedule migrations during low-traffic periods
- Monitor application after migration

### 4. Team Collaboration
- Commit migration files to version control
- Coordinate schema changes with team
- Use consistent naming conventions
- Document migration purposes

## Troubleshooting

### Common Issues

#### 1. Connection Failed
```
❌ DB connection failed
```
**Solution**: Check your `.env` configuration and database server status.

#### 2. Migration Already Applied
```
⚠️ Migration already applied
```
**Solution**: Check migration status with `npm run db:status`.

#### 3. Permission Denied
```
❌ Permission denied
```
**Solution**: Ensure database user has CREATE/ALTER permissions.

#### 4. Schema Conflicts
```
❌ Schema conflict detected
```
**Solution**: Review your model changes and regenerate migration.

### Recovery Procedures

#### 1. Failed Migration Recovery
```bash
# Check status
npm run db:status

# Rollback if needed
npm run db:rollback

# Fix issues and retry
npm run db:migrate
```

#### 2. Database Corruption
```bash
# Restore from latest backup
npm run db:rollback

# Or restore from specific backup
# (Manual process - check backup files)
```

## Support

If you encounter issues with migrations:

1. Check the logs for detailed error messages
2. Verify your environment configuration
3. Test with a fresh database instance
4. Review the migration files for syntax errors
5. Contact the development team for assistance

Remember: **Always backup your database before running migrations in production!**
