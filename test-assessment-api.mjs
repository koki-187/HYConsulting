import fetch from 'node-fetch';

const testData = {
  propertyType: 'house',
  prefecture: '北海道',
  city: '札幌市',
  area: null,
  buildingYear: null,
  stationName: null,
  walkingMinutes: null
};

console.log('Testing assessment API with:', JSON.stringify(testData, null, 2));

try {
  const response = await fetch('http://localhost:3000/api/trpc/assessment.getEstimate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(testData)
  });
  
  console.log('Response status:', response.status);
  const text = await response.text();
  console.log('Response body:', text);
} catch (error) {
  console.error('Error:', error.message);
}
