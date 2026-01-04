import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { URL } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Parse DATABASE_URL
const dbUrl = new URL(process.env.DATABASE_URL);
const DB_CONFIG = {
  host: dbUrl.hostname,
  port: dbUrl.port || 3306,
  user: dbUrl.username,
  password: dbUrl.password,
  database: dbUrl.pathname.slice(1),
  ssl: dbUrl.searchParams.get('ssl') ? JSON.parse(dbUrl.searchParams.get('ssl')) : undefined,
  waitForConnections: true,
  connectionLimit: 5,
  queueLimit: 0,
};

console.log('Database Configuration:');
console.log(`  Host: ${DB_CONFIG.host}:${DB_CONFIG.port}`);
console.log(`  Database: ${DB_CONFIG.database}`);
console.log(`  SSL: ${DB_CONFIG.ssl ? 'enabled' : 'disabled'}`);

async function main() {
  try {
    const pool = mysql.createPool(DB_CONFIG);
    const connection = await pool.getConnection();
    
    console.log('✓ Connected to database');
    
    // Test query
    const [result] = await connection.query('SELECT COUNT(*) as count FROM transactions');
    console.log(`Current transaction count: ${result[0].count}`);
    
    connection.release();
    await pool.end();
  } catch (error) {
    console.error('✗ Error:', error.message);
  }
}

main();
