import mysql from 'mysql2/promise';

const url = process.env.DATABASE_URL;
const connection = await mysql.createConnection(url);

try {
  const [columns] = await connection.query('SHOW COLUMNS FROM transactions');
  console.log('Transactions table columns:');
  columns.forEach(col => {
    console.log(`- ${col.Field} (${col.Type})`);
  });

  const [sample] = await connection.query('SELECT * FROM transactions LIMIT 1');
  console.log('\nSample data keys:');
  if (sample[0]) {
    console.log(Object.keys(sample[0]));
  }

} catch (error) {
  console.error('Error:', error.message);
} finally {
  await connection.end();
}
