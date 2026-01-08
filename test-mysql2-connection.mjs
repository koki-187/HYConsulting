import mysql2 from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL;

console.log('DATABASE_URL:', DATABASE_URL ? 'Set' : 'Not set');

try {
  // Test 1: Create pool
  console.log('\n=== Test 1: Creating MySQL2 pool ===');
  const pool = mysql2.createPool(DATABASE_URL);
  console.log('✓ Pool created successfully');

  // Test 2: Get connection
  console.log('\n=== Test 2: Getting connection from pool ===');
  const connection = await pool.getConnection();
  console.log('✓ Connection obtained successfully');

  // Test 3: Execute simple query
  console.log('\n=== Test 3: Executing simple query ===');
  const [rows] = await connection.query('SELECT 1 AS test');
  console.log('✓ Query executed successfully:', rows);

  // Test 4: Query transactions table
  console.log('\n=== Test 4: Querying transactions table ===');
  const [txRows] = await connection.query(`
    SELECT prefecture, city, propertyType, COUNT(*) as count
    FROM transactions
    WHERE prefecture = '東京都' AND city = '新宿区' AND propertyType = '宅地(土地と建物)'
    LIMIT 5
  `);
  console.log('✓ Transactions query result:', txRows);

  connection.release();
  await pool.end();

  console.log('\n=== All tests passed! ===');
} catch (error) {
  console.error('\n❌ Error:', error.message);
  console.error('Stack:', error.stack);
  process.exit(1);
}
