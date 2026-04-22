const API_BASE_URL = 'http://localhost:3000/api';

async function testGrowthCreate() {
  console.log('Testing growth indicator creation...');
  
  try {
    // Step 1: Login to get token
    console.log('\n1. Logging in with demo user');
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
    
    const loginData = await loginResponse.json();
    const token = loginData.data.token;
    
    // Step 2: Create a growth record
    console.log('\n2. Creating growth record');
    const createResponse = await fetch(`${API_BASE_URL}/growth`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        baby_id: '81cb659b-820d-4f1a-a672-f8a9e1463439',
        date: new Date().toISOString(),
        height: 65.5,
        weight: 7.2,
        head_circumference: 42.0,
        notes: 'Test growth record'
      })
    });
    
    console.log(`Create status: ${createResponse.status}`);
    const createData = await createResponse.json();
    console.log('Create response:', createData);
    
    if (createData.status === 'success') {
      console.log('\n3. Growth record created successfully!');
      
      // Step 3: Test getting growth records
      console.log('\n4. Getting growth records');
      const getResponse = await fetch(`${API_BASE_URL}/growth?baby_id=81cb659b-820d-4f1a-a672-f8a9e1463439`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log(`Get status: ${getResponse.status}`);
      const getData = await getResponse.json();
      console.log('Get response:', getData);
      
      // Step 4: Test editing the growth record
      if (getData.data.length > 0) {
        const growthId = getData.data[0].id;
        console.log('\n5. Editing growth record with id:', growthId);
        
        const editResponse = await fetch(`${API_BASE_URL}/growth/${growthId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            height: 66.0,
            weight: 7.5,
            notes: 'Updated test growth record'
          })
        });
        
        console.log(`Edit status: ${editResponse.status}`);
        const editData = await editResponse.json();
        console.log('Edit response:', editData);
        
        // Step 5: Test deleting the growth record
        console.log('\n6. Deleting growth record');
        const deleteResponse = await fetch(`${API_BASE_URL}/growth/${growthId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        console.log(`Delete status: ${deleteResponse.status}`);
        const deleteData = await deleteResponse.json();
        console.log('Delete response:', deleteData);
      }
    }
    
    console.log('\nTest completed!');
  } catch (error) {
    console.error('Error testing growth functionality:', error);
  }
}

testGrowthCreate();
