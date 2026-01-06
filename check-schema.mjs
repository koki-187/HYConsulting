import { getDb } from "./server/db.js";

async function checkSchema() {
  const db = await getDb();
  const result = await db.execute(`
    SELECT column_name, data_type 
    FROM information_schema.columns 
    WHERE table_name = 'aggregated_real_estate_data' 
    ORDER BY ordinal_position
  `);
  console.log(JSON.stringify(result.rows, null, 2));
}

checkSchema().catch(console.error);
