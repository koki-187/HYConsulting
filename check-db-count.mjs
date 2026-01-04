import mysql from 'mysql2/promise';

const connection = await mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'hy_consulting',
});

try {
  const [rows] = await connection.execute('SELECT COUNT(*) as count FROM property_database');
  console.log('Property Database Record Count:', rows[0].count);
  
  const [prefectures] = await connection.execute('SELECT DISTINCT prefecture FROM property_database');
  console.log('Prefectures:', prefectures.length);
  
  const [cities] = await connection.execute('SELECT DISTINCT city FROM property_database');
  console.log('Cities:', cities.length);
  
  const [types] = await connection.execute('SELECT DISTINCT propertyType FROM property_database');
  console.log('Property Types:', types.map(t => t.propertyType).join(', '));
} catch (error) {
  console.error('Error:', error.message);
} finally {
  await connection.end();
}
