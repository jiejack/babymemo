const sqlite3 = require('sqlite3').verbose();
const http = require('http');
const path = require('path');

// 测试1: 直接数据库连接测试
function testDirectDatabaseConnection() {
  console.log('=== 测试1: 直接数据库连接测试 ===');
  
  // 使用绝对路径
  const dbPath = path.resolve(__dirname, 'data.db');
  console.log('Database path:', dbPath);
  
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('❌ 数据库连接失败:', err.message);
        reject(err);
        return;
      }
      
      console.log('✅ 数据库连接成功!');
      
      // 测试查询1: 检查表结构
      db.all('SELECT name FROM sqlite_master WHERE type="table"', (err, rows) => {
        if (err) {
          console.error('❌ 查询表结构失败:', err.message);
          db.close();
          reject(err);
          return;
        }
        
        console.log('✅ 查询表结构成功!');
        console.log('数据库中的表:');
        rows.forEach(row => {
          console.log(`  - ${row.name}`);
        });
        
        // 测试查询2: 检查用户表数据
        db.all('SELECT COUNT(*) as count FROM users', (err, rows) => {
          if (err) {
            console.error('❌ 查询用户数据失败:', err.message);
            db.close();
            reject(err);
            return;
          }
          
          console.log('✅ 查询用户数据成功!');
          console.log(`用户表中有 ${rows[0].count} 条记录`);
          
          // 关闭连接
          db.close((err) => {
            if (err) {
              console.error('❌ 关闭连接失败:', err.message);
              reject(err);
              return;
            }
            
            console.log('✅ 数据库连接已关闭');
            resolve();
          });
        });
      });
    });
  });
}

// 测试2: Web API连接测试 - 注册
function testApiRegister() {
  console.log('\n=== 测试2: Web API连接测试 - 注册 ===');
  
  return new Promise((resolve, reject) => {
    const username = `testuser_${Date.now()}`;
    const postData = JSON.stringify({
      username: username,
      password: 'password123',
      name: '测试用户'
    });
    
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/users',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
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
          resolve({ username: username, password: 'password123' });
        } catch (e) {
          console.error('❌ 响应解析失败:', e.message);
          console.error('响应原始数据:', data);
          reject(e);
        }
      });
    });
    
    req.on('error', (e) => {
      console.error('❌ 请求失败:', e.message);
      reject(e);
    });
    
    req.on('timeout', () => {
      console.error('❌ 请求超时（20秒）');
      req.destroy();
      reject(new Error('Request timeout'));
    });
    
    // 发送请求体
    req.write(postData);
    req.end();
  });
}

// 测试3: Web API连接测试 - 登录
function testApiLogin(username) {
  console.log('\n=== 测试3: Web API连接测试 - 登录 ===');
  
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      username: username,
      password: 'password123'
    });
    
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/users/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
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
          if (response.status === 'success' && response.data && response.data.token) {
            resolve(response.data.token); // 返回token用于后续测试
          } else {
            reject(new Error('Login failed: no token returned'));
          }
        } catch (e) {
          console.error('❌ 响应解析失败:', e.message);
          console.error('响应原始数据:', data);
          reject(e);
        }
      });
    });
    
    req.on('error', (e) => {
      console.error('❌ 请求失败:', e.message);
      reject(e);
    });
    
    req.on('timeout', () => {
      console.error('❌ 请求超时（20秒）');
      req.destroy();
      reject(new Error('Request timeout'));
    });
    
    // 发送请求体
    req.write(postData);
    req.end();
  });
}

// 测试4: Web API连接测试 - 获取当前用户信息
function testApiGetCurrentUser(token) {
  console.log('\n=== 测试4: Web API连接测试 - 获取当前用户信息 ===');
  
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/users/me',
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      timeout: 20000 // 20秒超时
    };
    
    console.log('发送请求到:', options.path);
    console.log('Authorization header:', options.headers.Authorization.substring(0, 20) + '...');
    
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
          resolve();
        } catch (e) {
          console.error('❌ 响应解析失败:', e.message);
          console.error('响应原始数据:', data);
          reject(e);
        }
      });
    });
    
    req.on('error', (e) => {
      console.error('❌ 请求失败:', e.message);
      reject(e);
    });
    
    req.on('timeout', () => {
      console.error('❌ 请求超时（20秒）');
      req.destroy();
      reject(new Error('Request timeout'));
    });
    
    req.end();
  });
}

// 运行所有测试
async function runAllTests() {
  console.log('开始运行综合测试...\n');
  
  try {
    // 测试1: 直接数据库连接
    await testDirectDatabaseConnection();
    console.log('\n--- 测试1 完成 ---\n');
    
    // 测试2: API注册
    const registeredUser = await testApiRegister();
    console.log('\n--- 测试2 完成 ---\n');
    
    // 测试3: API登录
    const token = await testApiLogin(registeredUser.username);
    console.log('\n--- 测试3 完成 ---\n');
    
    // 测试4: API获取当前用户信息
    await testApiGetCurrentUser(token);
    console.log('\n--- 测试4 完成 ---\n');
    
    console.log('🎉 所有测试完成!');
    process.exit(0);
  } catch (error) {
    console.error('❌ 测试失败:', error.message);
    process.exit(1);
  }
}

// 运行测试
runAllTests();