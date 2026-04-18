const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// 测试数据库连接
function testDatabaseConnection() {
  console.log('=== 测试数据库连接 ===');
  
  // 使用绝对路径
  const dbPath = path.resolve(__dirname, 'data.db');
  console.log('Database path:', dbPath);
  
  const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
      console.error('❌ 数据库连接失败:', err.message);
      process.exit(1);
    } else {
      console.log('✅ 数据库连接成功!');
      
      // 测试查询
      db.all('SELECT name FROM sqlite_master WHERE type=\"table\"', (err, rows) => {
        if (err) {
          console.error('❌ 查询失败:', err.message);
          db.close();
          process.exit(1);
        } else {
          console.log('✅ 查询成功!');
          console.log('数据库中的表:');
          rows.forEach(row => {
            console.log(`  - ${row.name}`);
          });
          
          // 关闭连接
          db.close((err) => {
            if (err) {
              console.error('❌ 关闭连接失败:', err.message);
              process.exit(1);
            } else {
              console.log('✅ 数据库连接已关闭');
              console.log('\n=== 测试完成 ===');
              process.exit(0);
            }
          });
        }
      });
    }
  });
}

// 运行测试
testDatabaseConnection();
