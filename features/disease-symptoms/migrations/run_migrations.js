// Database Migration Runner for Disease Symptoms Education
// File: features/disease-symptoms/migrations/run_migrations.js

const fs = require('fs');
const path = require('path');
const { supabase } = require('../../../config/database');

class MigrationRunner {
  
  static async runMigrations() {
    try {
      console.log('🚀 Starting Disease Symptoms Education migrations...');
      
      // Create migrations tracking table if it doesn't exist
      await this.createMigrationsTable();
      
      // Get list of migration files
      const migrationFiles = this.getMigrationFiles();
      
      // Get already executed migrations
      const executedMigrations = await this.getExecutedMigrations();
      
      // Run pending migrations
      for (const file of migrationFiles) {
        if (!executedMigrations.includes(file)) {
          await this.executeMigration(file);
        } else {
          console.log(`⏭️  Skipping already executed migration: ${file}`);
        }
      }
      
      console.log('✅ All migrations completed successfully!');
      
      // Run seed data
      await this.runSeedData();
      
      console.log('🌱 Seed data inserted successfully!');
      
    } catch (error) {
      console.error('❌ Migration failed:', error);
      throw error;
    }
  }
  
  static async createMigrationsTable() {
    try {
      const createTableSQL = `
        CREATE TABLE IF NOT EXISTS migration_history (
          id SERIAL PRIMARY KEY,
          migration_name VARCHAR(255) NOT NULL UNIQUE,
          executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `;
      
      const { error } = await supabase.rpc('execute_sql', { sql: createTableSQL });
      if (error) throw error;
      
      console.log('📋 Migration tracking table ready');
    } catch (error) {
      console.error('Failed to create migrations table:', error);
      throw error;
    }
  }
  
  static getMigrationFiles() {
    const migrationsDir = path.join(__dirname);
    const files = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql') && file !== 'run_migrations.js')
      .sort();
    
    console.log(`📁 Found ${files.length} migration files:`, files);
    return files;
  }
  
  static async getExecutedMigrations() {
    try {
      const { data, error } = await supabase
        .from('migration_history')
        .select('migration_name');
      
      if (error) throw error;
      
      return data ? data.map(row => row.migration_name) : [];
    } catch (error) {
      console.log('No previous migrations found (this is normal for first run)');
      return [];
    }
  }
  
  static async executeMigration(filename) {
    try {
      console.log(`🔄 Executing migration: ${filename}`);
      
      // Read migration file
      const migrationPath = path.join(__dirname, filename);
      const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
      
      // Split by semicolon and execute each statement
      const statements = migrationSQL
        .split(';')
        .map(stmt => stmt.trim())
        .filter(stmt => stmt.length > 0);
      
      for (const statement of statements) {
        if (statement.trim()) {
          const { error } = await supabase.rpc('execute_sql', { sql: statement });
          if (error) {
            console.error(`Failed to execute statement: ${statement.substring(0, 100)}...`);
            throw error;
          }
        }
      }
      
      // Record migration as executed
      const { error: recordError } = await supabase
        .from('migration_history')
        .insert({ migration_name: filename });
      
      if (recordError) throw recordError;
      
      console.log(`✅ Migration completed: ${filename}`);
      
    } catch (error) {
      console.error(`❌ Migration failed: ${filename}`, error);
      throw error;
    }
  }
  
  static async runSeedData() {
    try {
      console.log('🌱 Running seed data...');
      
      // Read seed data file
      const seedPath = path.join(__dirname, '../seed-data/diseases_seed.sql');
      
      if (!fs.existsSync(seedPath)) {
        console.log('⚠️  No seed data file found, skipping...');
        return;
      }
      
      const seedSQL = fs.readFileSync(seedPath, 'utf8');
      
      // Split by semicolon and execute each statement
      const statements = seedSQL
        .split(';')
        .map(stmt => stmt.trim())
        .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
      
      for (const statement of statements) {
        if (statement.trim()) {
          const { error } = await supabase.rpc('execute_sql', { sql: statement });
          if (error) {
            // Log error but don't fail - seed data might already exist
            console.log(`⚠️  Seed statement skipped (might already exist): ${error.message}`);
          }
        }
      }
      
      console.log('✅ Seed data processing completed');
      
    } catch (error) {
      console.error('❌ Seed data failed:', error);
      // Don't throw - seed data failures shouldn't stop the migration
    }
  }
  
  static async rollbackMigration(filename) {
    try {
      console.log(`🔄 Rolling back migration: ${filename}`);
      
      // This would require rollback scripts - for now just remove from history
      const { error } = await supabase
        .from('migration_history')
        .delete()
        .eq('migration_name', filename);
      
      if (error) throw error;
      
      console.log(`✅ Migration rollback completed: ${filename}`);
      
    } catch (error) {
      console.error(`❌ Rollback failed: ${filename}`, error);
      throw error;
    }
  }
  
  static async getStatus() {
    try {
      const migrationFiles = this.getMigrationFiles();
      const executedMigrations = await this.getExecutedMigrations();
      
      console.log('\n📊 Migration Status:');
      console.log('===================');
      
      for (const file of migrationFiles) {
        const status = executedMigrations.includes(file) ? '✅ Executed' : '⏳ Pending';
        console.log(`${status} - ${file}`);
      }
      
      const pendingCount = migrationFiles.length - executedMigrations.length;
      console.log(`\n📈 Summary: ${executedMigrations.length} executed, ${pendingCount} pending`);
      
      return {
        total: migrationFiles.length,
        executed: executedMigrations.length,
        pending: pendingCount,
        files: migrationFiles.map(file => ({
          name: file,
          executed: executedMigrations.includes(file)
        }))
      };
      
    } catch (error) {
      console.error('❌ Failed to get migration status:', error);
      throw error;
    }
  }
}

// CLI interface
if (require.main === module) {
  const command = process.argv[2];
  
  switch (command) {
    case 'run':
      MigrationRunner.runMigrations()
        .then(() => process.exit(0))
        .catch(() => process.exit(1));
      break;
      
    case 'status':
      MigrationRunner.getStatus()
        .then(() => process.exit(0))
        .catch(() => process.exit(1));
      break;
      
    case 'rollback':
      const filename = process.argv[3];
      if (!filename) {
        console.error('Usage: node run_migrations.js rollback <filename>');
        process.exit(1);
      }
      MigrationRunner.rollbackMigration(filename)
        .then(() => process.exit(0))
        .catch(() => process.exit(1));
      break;
      
    default:
      console.log(`
Disease Symptoms Education - Migration Runner

Usage:
  node run_migrations.js run      - Run all pending migrations
  node run_migrations.js status   - Show migration status
  node run_migrations.js rollback <filename> - Rollback specific migration

Examples:
  node run_migrations.js run
  node run_migrations.js status
  node run_migrations.js rollback 001_create_diseases_tables.sql
      `);
      process.exit(0);
  }
}

module.exports = MigrationRunner;
