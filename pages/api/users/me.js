// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import jwt from 'jsonwebtoken';
import path from 'path';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

function getUserIdFromToken(req) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return null;
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded.id;
  } catch (error) {
    return null;
  }
}

export default function handler(req, res) {
  switch (req.method) {
    case 'GET':
      return getCurrentUser(req, res);
    case 'PUT':
      return updateUserHandler(req, res);
    default:
      res.setHeader('Allow', ['GET', 'PUT']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

async function getCurrentUser(req, res) {
  let db = null;
  try {
    const userId = getUserIdFromToken(req);
    if (!userId) {
      return res.status(401).json({ status: 'error', message: 'Unauthorized' });
    }
    
    // 打开数据库连接
    const dbPath = path.resolve(process.cwd(), 'data.db');
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database
    });
    
    const user = await db.get('SELECT * FROM users WHERE id = ?', [userId]);
    if (!user) {
      return res.status(401).json({ status: 'error', message: 'User not found' });
    }
    
    const { password: _, ...userWithoutPassword } = user;
    res.status(200).json({ status: 'success', data: userWithoutPassword });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ status: 'error', message: error.message || 'Internal server error' });
  } finally {
    // 关闭数据库连接
    if (db) {
      await db.close();
    }
  }
}

async function updateUserHandler(req, res) {
  let db = null;
  try {
    const userId = getUserIdFromToken(req);
    if (!userId) {
      return res.status(401).json({ status: 'error', message: 'Unauthorized' });
    }
    
    // 打开数据库连接
    const dbPath = path.resolve(process.cwd(), 'data.db');
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database
    });
    
    const { name, avatar } = req.body;
    await db.run('UPDATE users SET name = ?, avatar = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', 
      [name, avatar, userId]);
    
    const updatedUser = await db.get('SELECT * FROM users WHERE id = ?', [userId]);
    if (!updatedUser) {
      return res.status(401).json({ status: 'error', message: 'User not found' });
    }
    
    const { password: _, ...userWithoutPassword } = updatedUser;
    res.status(200).json({ status: 'success', message: 'User updated successfully', data: userWithoutPassword });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ status: 'error', message: error.message || 'Internal server error' });
  } finally {
    // 关闭数据库连接
    if (db) {
      await db.close();
    }
  }
}