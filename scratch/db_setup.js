import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://nicolas:cabrera@evolution-api_duoc-db:5432/duoc1?sslmode=disable',
  ssl: false
});

async function setup() {
  try {
    console.log('Checking database tables...');
    
    // Create campaigns table if not exists
    await pool.query(`
      CREATE TABLE IF NOT EXISTS campaigns (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        user_id INTEGER,
        group_id INTEGER,
        data JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Campaigns table checked.');

    // Create chatflows table if not exists
    await pool.query(`
      CREATE TABLE IF NOT EXISTS chatflows (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        user_id INTEGER,
        group_id INTEGER,
        data JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Chatflows table checked.');

    const tables = await pool.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'");
    console.log('Current tables:', tables.rows.map(r => r.table_name));

  } catch (err) {
    console.error('Error during setup:', err);
  } finally {
    await pool.end();
  }
}

setup();
