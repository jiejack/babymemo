import sqlite3 from 'sqlite3';
import bcrypt from 'bcryptjs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

// 获取当前文件的路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 使用绝对路径确保能找到数据库文件
const dbPath = resolve(__dirname, '../../data.db');
console.log('Database path:', dbPath);

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to the SQLite database.');
    initDatabase();
  }
});

function initDatabase() {
  // 创建用户表
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      name TEXT,
      avatar TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 创建宝宝表
  db.run(`
    CREATE TABLE IF NOT EXISTS babies (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      name TEXT NOT NULL,
      birthday DATETIME NOT NULL,
      gender TEXT,
      avatar TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 创建照片表
  db.run(`
    CREATE TABLE IF NOT EXISTS photos (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      baby_id TEXT,
      url TEXT NOT NULL,
      title TEXT,
      description TEXT,
      tags TEXT,
      category TEXT,
      date DATETIME NOT NULL,
      location TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 创建日记表
  db.run(`
    CREATE TABLE IF NOT EXISTS diaries (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      baby_id TEXT,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      images TEXT,
      videos TEXT,
      mood TEXT,
      weather TEXT,
      date DATETIME NOT NULL,
      category TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 创建事件表
  db.run(`
    CREATE TABLE IF NOT EXISTS events (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      baby_id TEXT,
      title TEXT NOT NULL,
      description TEXT,
      date DATETIME NOT NULL,
      type TEXT,
      color TEXT,
      reminder INTEGER DEFAULT 0,
      repeat TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 创建里程碑表
  db.run(`
    CREATE TABLE IF NOT EXISTS milestones (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      baby_id TEXT,
      title TEXT NOT NULL,
      description TEXT,
      date DATETIME NOT NULL,
      type TEXT,
      images TEXT,
      tags TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 创建成长指标表
  db.run(`
    CREATE TABLE IF NOT EXISTS growth_indicators (
      id TEXT PRIMARY KEY,
      baby_id TEXT NOT NULL,
      height REAL,
      weight REAL,
      head_circumference REAL,
      date DATETIME NOT NULL,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 创建视频表
  db.run(`
    CREATE TABLE IF NOT EXISTS videos (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      baby_id TEXT,
      url TEXT NOT NULL,
      title TEXT,
      description TEXT,
      tags TEXT,
      category TEXT,
      date DATETIME NOT NULL,
      duration INTEGER,
      thumbnail TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 创建设置表
  db.run(`
    CREATE TABLE IF NOT EXISTS settings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      key TEXT UNIQUE NOT NULL,
      value TEXT,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 插入演示用户
  bcrypt.hash('demo', 10, (err, hashedPassword) => {
    if (err) {
      console.error('Error hashing password:', err);
    } else {
      db.run(`
        INSERT OR IGNORE INTO users (id, username, password, name, avatar)
        VALUES ('demo-user-id', 'demo', ?, '演示用户', null)
      `, [hashedPassword], (err) => {
        if (err) {
          console.error('Error inserting demo user:', err);
        } else {
          console.log('Demo user inserted successfully');
        }
      });
    }
  });
}

export default db;