import mysql2 from "mysql2/promise";

try {
  const dbUrl = new URL(process.env.DATABASE_URL);
  
  const connection = await mysql2.createConnection({
    host: dbUrl.hostname,
    port: parseInt(dbUrl.port) || 3306,
    user: dbUrl.username,
    password: dbUrl.password,
    database: dbUrl.pathname.slice(1),
    ssl: { rejectUnauthorized: true }
  });

  console.log("✅ Database connection successful\n");

  // Check indexes on transactions table
  const [indexes] = await connection.query("SHOW INDEX FROM transactions");
  
  console.log("Indexes on transactions table:");
  console.log("=".repeat(80));
  
  const indexMap = new Map();
  indexes.forEach(idx => {
    if (!indexMap.has(idx.Key_name)) {
      indexMap.set(idx.Key_name, []);
    }
    indexMap.get(idx.Key_name).push(idx.Column_name);
  });

  indexMap.forEach((columns, indexName) => {
    console.log(`- ${indexName}: [${columns.join(", ")}]`);
  });

  console.log("\n" + "=".repeat(80));
  console.log("\n🔍 Checking if required indexes exist:");
  
  const hasPreferenceIndex = Array.from(indexMap.values()).some(cols => 
    cols.includes("prefecture")
  );
  const hasCityIndex = Array.from(indexMap.values()).some(cols => 
    cols.includes("city")
  );
  const hasPropertyTypeIndex = Array.from(indexMap.values()).some(cols => 
    cols.includes("propertyType")
  );
  const hasCompoundIndex = Array.from(indexMap.values()).some(cols => 
    cols.includes("prefecture") && cols.includes("city") && cols.includes("propertyType")
  );

  console.log(`- prefecture index: ${hasPreferenceIndex ? "✅ EXISTS" : "❌ MISSING"}`);
  console.log(`- city index: ${hasCityIndex ? "✅ EXISTS" : "❌ MISSING"}`);
  console.log(`- propertyType index: ${hasPropertyTypeIndex ? "✅ EXISTS" : "❌ MISSING"}`);
  console.log(`- compound (prefecture, city, propertyType): ${hasCompoundIndex ? "✅ EXISTS" : "❌ MISSING"}`);

  await connection.end();
} catch (error) {
  console.error("❌ Database error:", error.message);
}
