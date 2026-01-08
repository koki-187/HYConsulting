import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL;

console.log('DATABASE_URL:', DATABASE_URL ? 'Set' : 'Not set');

async function testAssessment() {
  try {
    const connection = await mysql.createConnection(DATABASE_URL);
    console.log('✓ Database connection successful');

    // Test query: Find Tokyo Shinjuku data
    const [rows] = await connection.execute(`
      SELECT COUNT(*) as count
      FROM transactions
      WHERE prefecture = '東京都'
        AND city = '新宿区'
        AND propertyType = '宅地(土地と建物)'
    `);

    console.log('✓ Query result:', rows[0]);

    await connection.end();
  } catch (error) {
    console.error('✗ Error:', error.message);
    console.error('Stack:', error.stack);
  }
}

testAssessment();
