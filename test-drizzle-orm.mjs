import { drizzle } from "drizzle-orm/mysql2";
import { eq, and } from "drizzle-orm";
import mysql2 from 'mysql2';
import { mysqlTable, varchar, bigint, int, timestamp } from 'drizzle-orm/mysql-core';

// Define transactions table schema
const transactions = mysqlTable('transactions', {
  id: bigint('id', { mode: 'number' }).primaryKey().autoincrement(),
  datasetVersionId: varchar('datasetVersionId', { length: 255 }),
  transactionYm: varchar('transactionYm', { length: 10 }),
  prefecture: varchar('prefecture', { length: 100 }),
  city: varchar('city', { length: 100 }),
  ward: varchar('ward', { length: 100 }),
  district: varchar('district', { length: 255 }),
  propertyType: varchar('propertyType', { length: 255 }),
  priceYen: bigint('priceYen', { mode: 'number' }),
  landAreaM2: varchar('landAreaM2', { length: 50 }),
  buildingAreaM2: varchar('buildingAreaM2', { length: 50 }),
  buildingYear: int('buildingYear'),
  createdAt: timestamp('createdAt').defaultNow(),
});

const DATABASE_URL = process.env.DATABASE_URL;

console.log('DATABASE_URL:', DATABASE_URL ? 'Set' : 'Not set');

try {
  // Test 1: Create MySQL2 pool
  console.log('\n=== Test 1: Creating MySQL2 pool ===');
  const url = new URL(DATABASE_URL);
  const pool = mysql2.createPool({
    host: url.hostname,
    port: parseInt(url.port) || 3306,
    user: url.username,
    password: url.password,
    database: url.pathname.slice(1),
    ssl: { rejectUnauthorized: true },
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });
  console.log('✓ Pool created successfully');

  // Test 2: Create Drizzle instance
  console.log('\n=== Test 2: Creating Drizzle instance ===');
  const db = drizzle(pool);
  console.log('✓ Drizzle instance created successfully');

  // Test 3: Execute Drizzle query
  console.log('\n=== Test 3: Executing Drizzle query ===');
  const results = await db
    .select()
    .from(transactions)
    .where(
      and(
        eq(transactions.prefecture, '東京都'),
        eq(transactions.city, '新宿区'),
        eq(transactions.propertyType, '宅地(土地と建物)')
      )
    )
    .limit(5);

  console.log('✓ Drizzle query executed successfully');
  console.log('Results:', results.length, 'rows');
  if (results.length > 0) {
    console.log('Sample:', results[0]);
  }

  pool.end();

  console.log('\n=== All tests passed! ===');
} catch (error) {
  console.error('\n❌ Error:', error.message);
  console.error('Stack:', error.stack);
  process.exit(1);
}
