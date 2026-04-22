const API_BASE_URL = 'http://localhost:3000/api';

async function testNewPassword() {
  console.log('Testing new password...');
  
  try {
    // Test login with new password 'demo'
    console.log('\nTesting login with username: demo, password: demo');
    const loginResponse = await fetch(`${API_BASE_URL}/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: 'demo',
        password: 'demo'
      })
    });
    
    console.log(`Login status: ${loginResponse.status}`);
    const loginData = await loginResponse.json();
    console.log('Login response:', loginData);
    
    if (loginData.status === 'success') {
      console.log('\n✓ Login successful with new password!');
    } else {
      console.log('\n✗ Login failed!');
    }
    
  } catch (error) {
    console.error('Error testing new password:', error);
  }
}

testNewPassword();
