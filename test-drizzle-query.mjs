import { getDb } from './server/db.ts';
import { transactions } from './drizzle/schema.ts';
import { eq, and, gte, lte, sql } from 'drizzle-orm';

console.log('Testing Drizzle ORM query...');

try {
  const db = getDb();
  console.log('Database connection established');

  // Test query: Find Tokyo Shinjuku detached houses
  const propertyType = '宅地(土地と建物)';
  const prefecture = '東京都';
  const city = '新宿区';

  console.log(`\nSearching for:`);
  console.log(`- Prefecture: ${prefecture}`);
  console.log(`- City: ${city}`);
  console.log(`- Property Type: ${propertyType}`);

  const results = await db
    .select()
    .from(transactions)
    .where(
      and(
        eq(transactions.prefecture, prefecture),
        eq(transactions.city, city),
        eq(transactions.propertyType, propertyType)
      )
    )
    .limit(5);

  console.log(`\nFound ${results.length} results:`);
  results.forEach((r, i) => {
    console.log(`\n${i + 1}. ${r.prefecture} ${r.city}`);
    console.log(`   Type: ${r.propertyType}`);
    console.log(`   Price: ¥${r.priceYen?.toLocaleString() || 'N/A'}`);
    console.log(`   Area: ${r.landAreaM2}㎡`);
    console.log(`   Year: ${r.buildingYear || 'N/A'}`);
  });

  process.exit(0);
} catch (error) {
  console.error('\n❌ Error:', error.message);
  console.error('Stack:', error.stack);
  process.exit(1);
}
