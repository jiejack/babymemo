const http = require('http');

// 测试 API 连接
function testApiConnection() {
  console.log('=== 测试 API 连接 ===');
  
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/users',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(JSON.stringify({
        username: 'testuser123',
        password: 'password123',
        name: '测试用户'
      }))
    },
    timeout: 20000 // 20秒超时
  };
  
  const req = http.request(options, (res) => {
    console.log(`✅ 响应状态码: ${res.statusCode}`);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      try {
        const response = JSON.parse(data);
        console.log('✅ 响应数据:', JSON.stringify(response, null, 2));
      } catch (e) {
        console.error('❌ 响应解析失败:', e.message);
        console.error('响应原始数据:', data);
      }
      console.log('\n=== 测试完成 ===');
    });
  });
  
  req.on('error', (e) => {
    console.error('❌ 请求失败:', e.message);
    console.log('\n=== 测试完成 ===');
  });
  
  req.on('timeout', () => {
    console.error('❌ 请求超时（20秒）');
    req.destroy();
    console.log('\n=== 测试完成 ===');
  });
  
  // 发送请求体
  req.write(JSON.stringify({
    username: 'testuser123',
    password: 'password123',
    name: '测试用户'
  }));
  
  req.end();
}

// 运行测试
testApiConnection();
