// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import path from 'path';

export default function handler(req, res) {
  switch (req.method) {
    case 'POST':
      return handleRegister(req, res);
    default:
      res.setHeader('Allow', ['POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

async function handleRegister(req, res) {
  let db = null;
  try {
    // 打开数据库连接
    const dbPath = path.resolve(process.cwd(), 'data.db');
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database
    });
    
    const { username, password, name } = req.body;
    
    // 检查用户名是否已存在
    const existingUser = await db.get('SELECT * FROM users WHERE username = ?', [username]);
    if (existingUser) {
      return res.status(400).json({ status: 'error', message: 'Username already exists' });
    }
    
    // 创建用户
    const id = uuidv4();
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.run('INSERT INTO users (id, username, password, name, avatar) VALUES (?, ?, ?, ?, ?)', 
      [id, username, hashedPassword, name || username, null]);
    
    // 返回用户信息（不带密码）
    const userWithoutPassword = {
      id,
      username,
      name: name || username,
      avatar: null
    };
    
    res.status(201).json({ status: 'success', message: 'User registered successfully', data: userWithoutPassword });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ status: 'error', message: error.message || 'Internal server error' });
  } finally {
    // 关闭数据库连接
    if (db) {
      await db.close();
    }
  }
}