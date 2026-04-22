const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const path = require('path');

async function fixDates() {
  const dbPath = path.resolve(process.cwd(), 'data.db');
  const db = await open({
    filename: dbPath,
    driver: sqlite3.Database
  });

  // 获取所有里程碑
  const milestones = await db.all('SELECT id, date FROM milestones');
  
  console.log(`找到 ${milestones.length} 个里程碑`);
  
  // 更新每个里程碑的日期格式
  for (const m of milestones) {
    try {
      const normalizedDate = new Date(m.date).toISOString();
      await db.run('UPDATE milestones SET date = ? WHERE id = ?', [normalizedDate, m.id]);
      console.log(`更新里程碑 ${m.id}: ${m.date} -> ${normalizedDate}`);
    } catch (error) {
      console.error(`更新里程碑 ${m.id} 失败:`, error);
    }
  }

  console.log('日期格式统一完成！');
  await db.close();
}

fixDates().catch(console.error);
