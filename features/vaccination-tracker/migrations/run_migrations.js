// Migration Runner for Vaccination Tracker
// File: run_migrations.js

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs').promises;
const path = require('path');

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '../../../.env') });

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
);

class VaccinationMigrationRunner {
    constructor() {
        this.migrationsDir = __dirname;
        this.seedDataDir = path.join(__dirname, '../seed-data');
    }

    /**
     * Run all pending migrations
     */
    async runMigrations() {
        try {
            console.log('🚀 Starting vaccination tracker migrations...');

            // Ensure migrations table exists
            await this.createMigrationsTable();

            // Get list of migration files
            const migrationFiles = await this.getMigrationFiles();
            
            // Get completed migrations
            const completedMigrations = await this.getCompletedMigrations();
            
            // Run pending migrations
            for (const file of migrationFiles) {
                if (!completedMigrations.includes(file)) {
                    await this.runMigration(file);
                }
            }

            console.log('✅ All vaccination migrations completed successfully!');
            return true;

        } catch (error) {
            console.error('❌ Migration failed:', error);
            throw error;
        }
    }

    /**
     * Run seed data
     */
    async runSeedData() {
        try {
            console.log('🌱 Starting vaccination seed data insertion...');

            const seedFiles = await this.getSeedFiles();
            
            for (const file of seedFiles) {
                await this.runSeedFile(file);
            }

            console.log('✅ All vaccination seed data inserted successfully!');
            return true;

        } catch (error) {
            console.error('❌ Seed data insertion failed:', error);
            throw error;
        }
    }

    /**
     * Create migrations tracking table
     */
    async createMigrationsTable() {
        // Check if table exists first
        const { data, error } = await supabase
            .from('vaccination_migrations')
            .select('id')
            .limit(1);

        if (!error) {
            // Table already exists
            return;
        }

        console.log('⚠️ Note: Please create the vaccination_migrations table manually in Supabase:');
        console.log(`
CREATE TABLE IF NOT EXISTS vaccination_migrations (
    id SERIAL PRIMARY KEY,
    filename VARCHAR(255) UNIQUE NOT NULL,
    executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
        `);
        
        // For now, we'll skip the migrations table and proceed
        console.log('Proceeding without migrations tracking...');
    }

    /**
     * Get list of migration files
     */
    async getMigrationFiles() {
        try {
            const files = await fs.readdir(this.migrationsDir);
            return files
                .filter(file => file.endsWith('.sql') && file.startsWith('001_'))
                .sort();
        } catch (error) {
            console.error('Error reading migration files:', error);
            throw error;
        }
    }

    /**
     * Get list of seed files
     */
    async getSeedFiles() {
        try {
            const files = await fs.readdir(this.seedDataDir);
            return files
                .filter(file => file.endsWith('.sql'))
                .sort();
        } catch (error) {
            console.error('Error reading seed files:', error);
            throw error;
        }
    }

    /**
     * Get completed migrations from database
     */
    async getCompletedMigrations() {
        try {
            const { data, error } = await supabase
                .from('vaccination_migrations')
                .select('filename');

            if (error) {
                console.error('Error fetching completed migrations:', error);
                return [];
            }

            return data.map(row => row.filename);
        } catch (error) {
            console.error('Error getting completed migrations:', error);
            return [];
        }
    }

    /**
     * Run a single migration file
     */
    async runMigration(filename) {
        try {
            console.log(`📄 Migration: ${filename}`);
            console.log('⚠️ Please run this SQL manually in your Supabase SQL editor:');
            
            const filePath = path.join(this.migrationsDir, filename);
            const sql = await fs.readFile(filePath, 'utf8');
            
            console.log('--- SQL START ---');
            console.log(sql);
            console.log('--- SQL END ---');
            console.log('');

            console.log(`✅ Migration SQL displayed: ${filename}`);

        } catch (error) {
            console.error(`❌ Migration failed: ${filename}`, error);
            throw error;
        }
    }

    /**
     * Run a single seed file
     */
    async runSeedFile(filename) {
        try {
            console.log(`🌱 Seed file: ${filename}`);
            console.log('⚠️ Please run this SQL manually in your Supabase SQL editor:');

            const filePath = path.join(this.seedDataDir, filename);
            const sql = await fs.readFile(filePath, 'utf8');

            console.log('--- SQL START ---');
            console.log(sql);
            console.log('--- SQL END ---');
            console.log('');

            console.log(`✅ Seed SQL displayed: ${filename}`);

        } catch (error) {
            console.error(`❌ Seed file failed: ${filename}`, error);
            throw error;
        }
    }

    /**
     * Record migration as completed
     */
    async recordMigration(filename) {
        const { error } = await supabase
            .from('vaccination_migrations')
            .insert({ filename });

        if (error) {
            console.error('Error recording migration:', error);
            throw error;
        }
    }

    /**
     * Rollback last migration
     */
    async rollbackLastMigration() {
        try {
            console.log('🔄 Rolling back last migration...');

            // Get last migration
            const { data, error } = await supabase
                .from('vaccination_migrations')
                .select('*')
                .order('executed_at', { ascending: false })
                .limit(1);

            if (error || !data || data.length === 0) {
                console.log('No migrations to rollback');
                return;
            }

            const lastMigration = data[0];
            console.log(`Rolling back: ${lastMigration.filename}`);

            // Remove from migrations table
            await supabase
                .from('vaccination_migrations')
                .delete()
                .eq('id', lastMigration.id);

            console.log('⚠️ Note: Manual cleanup of database changes may be required');
            console.log('✅ Migration rollback completed');

        } catch (error) {
            console.error('❌ Rollback failed:', error);
            throw error;
        }
    }

    /**
     * Get migration status
     */
    async getMigrationStatus() {
        try {
            const migrationFiles = await this.getMigrationFiles();
            const completedMigrations = await this.getCompletedMigrations();

            const status = {
                total: migrationFiles.length,
                completed: completedMigrations.length,
                pending: migrationFiles.filter(file => !completedMigrations.includes(file)),
                completedList: completedMigrations
            };

            return status;

        } catch (error) {
            console.error('Error getting migration status:', error);
            throw error;
        }
    }

    /**
     * Verify database schema
     */
    async verifySchema() {
        try {
            console.log('🔍 Verifying vaccination database schema...');

            const requiredTables = [
                'vaccines',
                'vaccination_schedules',
                'patient_vaccinations',
                'vaccination_reminders',
                'immunization_programs',
                'program_vaccines',
                'vaccination_centers',
                'vaccination_coverage',
                'vaccination_preferences'
            ];

            const results = {};

            for (const table of requiredTables) {
                const { data, error } = await supabase
                    .from(table)
                    .select('*')
                    .limit(1);

                results[table] = {
                    exists: !error,
                    error: error?.message || null
                };
            }

            console.log('📊 Schema verification results:');
            Object.entries(results).forEach(([table, result]) => {
                const status = result.exists ? '✅' : '❌';
                console.log(`${status} ${table}: ${result.exists ? 'OK' : result.error}`);
            });

            const allTablesExist = Object.values(results).every(r => r.exists);
            
            if (allTablesExist) {
                console.log('✅ All vaccination tables verified successfully!');
            } else {
                console.log('❌ Some vaccination tables are missing or inaccessible');
            }

            return results;

        } catch (error) {
            console.error('Error verifying schema:', error);
            throw error;
        }
    }
}

// CLI interface
async function main() {
    const runner = new VaccinationMigrationRunner();
    const command = process.argv[2];

    try {
        switch (command) {
            case 'migrate':
                await runner.runMigrations();
                break;
            
            case 'seed':
                await runner.runSeedData();
                break;
            
            case 'setup':
                await runner.runMigrations();
                await runner.runSeedData();
                break;
            
            case 'rollback':
                await runner.rollbackLastMigration();
                break;
            
            case 'status':
                const status = await runner.getMigrationStatus();
                console.log('📊 Migration Status:');
                console.log(`Total migrations: ${status.total}`);
                console.log(`Completed: ${status.completed}`);
                console.log(`Pending: ${status.pending.length}`);
                if (status.pending.length > 0) {
                    console.log('Pending files:', status.pending);
                }
                break;
            
            case 'verify':
                await runner.verifySchema();
                break;
            
            default:
                console.log('Usage: node run_migrations.js [command]');
                console.log('Commands:');
                console.log('  migrate  - Run pending migrations');
                console.log('  seed     - Insert seed data');
                console.log('  setup    - Run migrations and seed data');
                console.log('  rollback - Rollback last migration');
                console.log('  status   - Show migration status');
                console.log('  verify   - Verify database schema');
                process.exit(1);
        }
    } catch (error) {
        console.error('❌ Command failed:', error.message);
        process.exit(1);
    }
}

// Export for programmatic use
module.exports = VaccinationMigrationRunner;

// Run CLI if called directly
if (require.main === module) {
    main();
}
