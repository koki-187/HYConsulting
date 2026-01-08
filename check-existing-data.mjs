import { getDb } from "./server/db.js";

const db = getDb();

console.log("=== 既存データベースの都道府県別件数 ===\n");

const prefectures = await db.all(`
  SELECT prefecture, COUNT(*) as count
  FROM transactions
  GROUP BY prefecture
  ORDER BY prefecture
`);

let total = 0;
for (const p of prefectures) {
  console.log(`${p.prefecture}: ${p.count.toLocaleString()}件`);
  total += p.count;
}

console.log(`\n合計: ${total.toLocaleString()}件`);
console.log(`都道府県数: ${prefectures.length}都道府県`);

process.exit(0);
