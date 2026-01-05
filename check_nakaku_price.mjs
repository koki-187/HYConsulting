import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import { transactions } from './drizzle/schema.js';
import { sql, eq, and } from 'drizzle-orm';
import * as dotenv from 'dotenv';

dotenv.config();

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection);

console.log('=== Checking Nakaku (中区) Average Price ===\n');

// Query 1: Check all Nakaku mansion data
const nakakuData = await db
  .select()
  .from(transactions)
  .where(
    and(
      eq(transactions.prefecture, '神奈川県'),
      eq(transactions.city, '横浜市中区'),
      eq(transactions.propertyType, 'マンション')
    )
  );

console.log(`Total Nakaku mansion records: ${nakakuData.length}\n`);

if (nakakuData.length > 0) {
  console.log('Sample records:');
  nakakuData.slice(0, 5).forEach((record, idx) => {
    console.log(`\nRecord ${idx + 1}:`);
    console.log(`  Address: ${record.address}`);
    console.log(`  Price (Yen): ${record.priceYen}`);
    console.log(`  Price (万円): ${Number(record.priceYen) / 10000}`);
    console.log(`  Area (㎡): ${record.areaSqm}`);
    console.log(`  Price per ㎡ (万円): ${Number(record.priceYen) / 10000 / Number(record.areaSqm)}`);
    console.log(`  Building age: ${record.buildingAge}`);
    console.log(`  Station: ${record.nearestStation}`);
    console.log(`  Walking minutes: ${record.walkingMinutes}`);
  });
}

// Query 2: Calculate average price
const avgResult = await db
  .select({
    averagePrice: sql`AVG(${transactions.priceYen})`,
    medianCalc: sql`COUNT(*)`,
    minPrice: sql`MIN(${transactions.priceYen})`,
    maxPrice: sql`MAX(${transactions.priceYen})`,
  })
  .from(transactions)
  .where(
    and(
      eq(transactions.prefecture, '神奈川県'),
      eq(transactions.city, '横浜市中区'),
      eq(transactions.propertyType, 'マンション')
    )
  );

console.log('\n=== Price Statistics ===');
console.log(`Average Price (Yen): ${avgResult[0].averagePrice}`);
console.log(`Average Price (万円): ${Number(avgResult[0].averagePrice) / 10000}`);
console.log(`Min Price (万円): ${Number(avgResult[0].minPrice) / 10000}`);
console.log(`Max Price (万円): ${Number(avgResult[0].maxPrice) / 10000}`);
console.log(`Total records: ${avgResult[0].medianCalc}`);

await connection.end();
