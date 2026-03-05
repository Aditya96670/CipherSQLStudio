import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: './.env' });

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

async function check() {
    try {
        const tables = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
        console.log("Tables:", tables.rows.map(r => r.table_name));

        for (const table of tables.rows) {
            const columns = await pool.query(`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = $1
      `, [table.table_name]);
            console.log(`Columns for ${table.table_name}:`, columns.rows);

            const count = await pool.query(`SELECT COUNT(*) FROM ${table.table_name}`);
            console.log(`Row count for ${table.table_name}:`, count.rows[0].count);
        }
    } catch (err) {
        console.error(err);
    } finally {
        await pool.end();
    }
}

check();
