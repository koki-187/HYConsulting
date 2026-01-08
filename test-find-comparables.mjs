import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import { eq, and } from 'drizzle-orm';
import { transactions } from './drizzle/schema.js';

const DATABASE_URL = process.env.DATABASE_URL;

async function testFindComparables() {
  const connection = await mysql.createConnection({
    uri: DATABASE_URL,
    ssl: { rejectUnauthorized: true }
  });

  const db = drizzle(connection);

  console.log('Testing findComparables for 東京都 新宿区 戸建て...\n');

  // Test 1: Check if data exists
  console.log('Test 1: Checking if data exists...');
  const [countResult] = await connection.execute(`
    SELECT COUNT(*) as count
    FROM transactions
    WHERE prefecture = '東京都'
    AND city = '新宿区'
    AND propertyType = '宅地(土地と建物)'
  `);
  console.log(`  Found ${countResult[0].count} records\n`);

  // Test 2: Use Drizzle ORM (same as assessment.ts)
  console.log('Test 2: Using Drizzle ORM (same as assessment.ts)...');
  const comparables = await db
    .select()
    .from(transactions)
    .where(
      and(
        eq(transactions.prefecture, '東京都'),
        eq(transactions.city, '新宿区'),
        eq(transactions.propertyType, '宅地(土地と建物)')
      )
    );
  
  console.log(`  Found ${comparables.length} records via Drizzle ORM`);
  
  if (comparables.length > 0) {
    console.log('\n  Sample record:');
    console.log(`    Prefecture: ${comparables[0].prefecture}`);
    console.log(`    City: ${comparables[0].city}`);
    console.log(`    PropertyType: ${comparables[0].propertyType}`);
    console.log(`    Price: ${comparables[0].priceYen}`);
  }

  await connection.end();
}

testFindComparables().catch(console.error);
