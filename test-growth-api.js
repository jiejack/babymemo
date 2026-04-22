const fetch = require('node-fetch');

const API_BASE_URL = 'http://localhost:3000/api';

async function testGrowthAPI() {
  console.log('Testing Growth API endpoints...');
  
  try {
    // Test 1: Get all growth records (should return 401 without token)
    console.log('\n1. Testing GET /growth');
    const response1 = await fetch(`${API_BASE_URL}/growth?baby_id=1`);
    console.log(`Status: ${response1.status}`);
    const data1 = await response1.json();
    console.log('Response:', data1);
    
    // Test 2: Create a growth record (should return 401 without token)
    console.log('\n2. Testing POST /growth');
    const response2 = await fetch(`${API_BASE_URL}/growth`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        baby_id: '1',
        date: new Date().toISOString(),
        height: 65.5,
        weight: 7.2,
        head_circumference: 42.0,
        notes: 'Test growth record'
      })
    });
    console.log(`Status: ${response2.status}`);
    const data2 = await response2.json();
    console.log('Response:', data2);
    
    console.log('\nTest completed!');
  } catch (error) {
    console.error('Error testing Growth API:', error);
  }
}

testGrowthAPI();
