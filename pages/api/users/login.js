// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// 初始化数据库表
async function initDatabase(db) {
  // 创建用户表
  await db.run(`
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
  await db.run(`
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
  await db.run(`
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
  await db.run(`
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
  await db.run(`
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
  await db.run(`
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
  await db.run(`
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
  await db.run(`
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
  await db.run(`
    CREATE TABLE IF NOT EXISTS settings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      key TEXT UNIQUE NOT NULL,
      value TEXT,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 插入演示用户（仅当不存在时）
  const hashedPassword = await bcrypt.hash('demo', 10);
  await db.run(`
    INSERT OR IGNORE INTO users (id, username, password, name, avatar)
    VALUES ('demo-user-id', 'demo', ?, '演示用户', null)
  `, [hashedPassword]);
}

export default async function handler(req, res) {
  if (req.method === 'POST') {
    return await handleLogin(req, res);
  }
  res.setHeader('Allow', ['POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}

async function handleLogin(req, res) {
  let db = null;
  try {
    // 打开数据库连接
    const dbPath = path.resolve(process.cwd(), 'data.db');
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database
    });
    
    // 初始化数据库表
    await initDatabase(db);
    
    const { username, password } = req.body;
    
    // 查找用户
    const user = await db.get('SELECT * FROM users WHERE username = ?', [username]);
    if (!user) {
      return res.status(401).json({ status: 'error', message: 'Invalid credentials' });
    }
    
    // 验证密码
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ status: 'error', message: 'Invalid credentials' });
    }
    
    // 生成 token
    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '7d' });
    
    // 移除密码字段
    const { password: _, ...userWithoutPassword } = user;
    
    res.status(200).json({ status: 'success', message: 'Login successful', data: { user: userWithoutPassword, token } });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ status: 'error', message: error.message || 'Internal server error' });
  } finally {
    // 关闭数据库连接
    if (db) {
      await db.close();
    }
  }
}