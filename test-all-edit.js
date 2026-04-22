const API_BASE_URL = 'http://localhost:3000/api';

async function testAllEditFunctions() {
  console.log('Testing all edit functions...');
  
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
        password: 'demo'
      })
    });
    
    const loginData = await loginResponse.json();
    const token = loginData.data.token;
    console.log('Login successful, token obtained');
    
    // Step 2: Test diary edit functionality
    console.log('\n2. Testing diary edit functionality');
    const diariesResponse = await fetch(`${API_BASE_URL}/diaries`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const diariesData = await diariesResponse.json();
    
    if (diariesData.data.length > 0) {
      const diaryId = diariesData.data[0].id;
      console.log('Testing edit for diary:', diaryId);
      
      // Get diary details
      const diaryDetailsResponse = await fetch(`${API_BASE_URL}/diaries?id=${diaryId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const diaryDetails = await diaryDetailsResponse.json();
      console.log('Diary details:', diaryDetails.data);
      
      // Update diary
      const updateResponse = await fetch(`${API_BASE_URL}/diaries?id=${diaryId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: diaryDetails.data.title + ' (updated)',
          content: diaryDetails.data.content + '\nUpdated content'
        })
      });
      
      const updateData = await updateResponse.json();
      console.log('Diary update result:', updateData);
    } else {
      console.log('No diaries found, skipping diary edit test');
    }
    
    // Step 3: Test milestone edit functionality
    console.log('\n3. Testing milestone edit functionality');
    const milestonesResponse = await fetch(`${API_BASE_URL}/milestones`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const milestonesData = await milestonesResponse.json();
    
    if (milestonesData.data.length > 0) {
      const milestoneId = milestonesData.data[0].id;
      console.log('Testing edit for milestone:', milestoneId);
      
      // Get milestone details
      const milestoneDetailsResponse = await fetch(`${API_BASE_URL}/milestones?id=${milestoneId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const milestoneDetails = await milestoneDetailsResponse.json();
      console.log('Milestone details:', milestoneDetails.data);
      
      // Update milestone
      const updateResponse = await fetch(`${API_BASE_URL}/milestones?id=${milestoneId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: milestoneDetails.data.title + ' (updated)',
          description: milestoneDetails.data.description + '\nUpdated description'
        })
      });
      
      const updateData = await updateResponse.json();
      console.log('Milestone update result:', updateData);
    } else {
      console.log('No milestones found, skipping milestone edit test');
    }
    
    // Step 4: Test video edit functionality
    console.log('\n4. Testing video edit functionality');
    let videoId = null;
    
    // Check if there are any videos
    const videosResponse = await fetch(`${API_BASE_URL}/videos`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const videosData = await videosResponse.json();
    
    if (videosData.data.length > 0) {
      videoId = videosData.data[0].id;
      console.log('Found existing video:', videoId);
    } else {
      // Create a test video if none exists
      console.log('No videos found, creating a test video...');
      const createVideoResponse = await fetch(`${API_BASE_URL}/videos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: '测试视频',
          description: '这是一个测试视频',
          url: '/uploads/videos/test.mp4',
          date: new Date().toISOString(),
          duration: 60
        })
      });
      
      const createVideoData = await createVideoResponse.json();
      if (createVideoData.status === 'success' && createVideoData.data) {
        videoId = createVideoData.data.id;
        console.log('Created test video:', videoId);
      } else {
        console.log('Failed to create test video:', createVideoData.message);
      }
    }
    
    if (videoId) {
      console.log('Testing edit for video:', videoId);
      
      // Get video details
      const videoDetailsResponse = await fetch(`${API_BASE_URL}/videos?id=${videoId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const videoDetails = await videoDetailsResponse.json();
      console.log('Video details:', videoDetails.data);
      
      // Update video
      const updateResponse = await fetch(`${API_BASE_URL}/videos?id=${videoId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: videoDetails.data.title + ' (updated)',
          description: 'Updated video description'
        })
      });
      
      const updateData = await updateResponse.json();
      console.log('Video update result:', updateData);
    } else {
      console.log('No videos available, skipping video edit test');
    }
    
    // Step 5: Test growth edit functionality
    console.log('\n5. Testing growth edit functionality');
    const babiesResponse = await fetch(`${API_BASE_URL}/babies`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const babiesData = await babiesResponse.json();
    
    if (babiesData.data.length > 0) {
      const babyId = babiesData.data[0].id;
      const growthsResponse = await fetch(`${API_BASE_URL}/growth?baby_id=${babyId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const growthsData = await growthsResponse.json();
      
      if (growthsData.data.length > 0) {
        const growthId = growthsData.data[0].id;
        console.log('Testing edit for growth:', growthId);
        
        // Get growth details
        const growthDetailsResponse = await fetch(`${API_BASE_URL}/growth?id=${growthId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const growthDetails = await growthDetailsResponse.json();
        console.log('Growth details:', growthDetails.data);
        
        // Update growth
        const updateResponse = await fetch(`${API_BASE_URL}/growth?id=${growthId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            height: (parseFloat(growthDetails.data.height) + 0.5).toString(),
            weight: (parseFloat(growthDetails.data.weight) + 0.2).toString(),
            notes: 'Updated growth record'
          })
        });
        
        const updateData = await updateResponse.json();
        console.log('Growth update result:', updateData);
      } else {
        console.log('No growth records found, skipping growth edit test');
      }
    } else {
      console.log('No babies found, skipping growth edit test');
    }
    
    console.log('\nAll edit function tests completed!');
  } catch (error) {
    console.error('Error testing edit functions:', error);
  }
}

testAllEditFunctions();
