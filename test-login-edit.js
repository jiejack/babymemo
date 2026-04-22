

const API_BASE_URL = 'http://localhost:3000/api';

async function testLoginAndEdit() {
  console.log('Testing login and edit functionality...');
  
  try {
    // Step 1: Login to get token
    console.log('\n1. Testing login with demo user');
    const loginResponse = await fetch(`${API_BASE_URL}/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: 'demo',
        password: 'password123'
      })
    });
    
    console.log(`Login status: ${loginResponse.status}`);
    const loginData = await loginResponse.json();
    console.log('Login response:', loginData);
    
    if (loginData.status !== 'success') {
      console.error('Login failed!');
      return;
    }
    
    const token = loginData.data.token;
    console.log('\n2. Token obtained successfully:', token.substring(0, 20) + '...');
    
    // Step 2: Test getting all babies
    console.log('\n3. Testing GET /babies');
    const babiesResponse = await fetch(`${API_BASE_URL}/babies`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log(`Status: ${babiesResponse.status}`);
    const babiesData = await babiesResponse.json();
    console.log('Babies response:', babiesData);
    
    // Step 3: Test growth endpoints
    console.log('\n4. Testing GET /growth');
    const growthResponse = await fetch(`${API_BASE_URL}/growth?baby_id=1`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log(`Status: ${growthResponse.status}`);
    const growthData = await growthResponse.json();
    console.log('Growth response:', growthData);
    
    console.log('\nTest completed!');
  } catch (error) {
    console.error('Error testing login and edit:', error);
  }
}

testLoginAndEdit();
