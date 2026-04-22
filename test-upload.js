const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
const FormData = require('form-data');

async function testUpload() {
  try {
    // 先登录获取token
    const loginResponse = await fetch('http://localhost:3000/api/users/login', {
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
    if (!loginData.data || !loginData.data.token) {
      console.error('Login failed:', loginData);
      return;
    }
    
    const token = loginData.data.token;
    console.log('Login successful, token:', token);
    
    // 准备FormData
    const formData = new FormData();
    const file = fs.createReadStream(path.join(__dirname, 'public', 'uploads', 'photos', 'test-photo.jpg'));
    formData.append('file', file, 'test-photo.jpg');
    formData.append('title', '测试上传照片4');
    formData.append('description', '这是测试上传的照片4');
    formData.append('category', '生活');
    
    // 上传照片
    const headers = {
      'Authorization': `Bearer ${token}`,
      ...formData.getHeaders()
    };
    
    const uploadResponse = await fetch('http://localhost:3000/api/photos', {
      method: 'POST',
      headers: headers,
      body: formData
    });
    
    const uploadData = await uploadResponse.json();
    console.log('Upload result:', uploadData);
    
    if (uploadData.status === 'success' && uploadData.data) {
      console.log('Upload successful!');
      console.log('Photo URL:', uploadData.data.url);
      
      // 检查文件是否存在
      const photoPath = path.join(__dirname, 'public', uploadData.data.url);
      if (fs.existsSync(photoPath)) {
        console.log('Photo file exists:', photoPath);
      } else {
        console.error('Photo file not found:', photoPath);
      }
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

testUpload();
