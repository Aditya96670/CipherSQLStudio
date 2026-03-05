import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config({ path: './.env' });

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

async function migrate() {
    try {
        console.log("Starting migration...");

        // Add columns if they don't exist
        await pool.query(`
      ALTER TABLE assignments 
      ADD COLUMN IF NOT EXISTS hint TEXT,
      ADD COLUMN IF NOT EXISTS target_table VARCHAR(50) DEFAULT 'students',
      ADD COLUMN IF NOT EXISTS sample_query TEXT
    `);

        console.log("Schema updated successfully.");
    } catch (err) {
        console.error("Migration failed:", err);
    } finally {
        await pool.end();
    }
}

migrate();
