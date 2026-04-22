// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

let db = null;

async function getDbConnection() {
  if (!db) {
    db = await open({
      filename: './data.db',
      driver: sqlite3.Database
    });
  }
  return db;
}

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
      return getSettings(req, res);
    case 'POST':
      return updateSetting(req, res);
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

async function getSettings(req, res) {
  try {
    const userId = getUserIdFromToken(req);
    if (!userId) {
      return res.status(401).json({ status: 'error', message: 'Unauthorized' });
    }
    
    const { key } = req.query;
    const db = await getDbConnection();
    let settings;
    
    if (key) {
      settings = await db.get('SELECT * FROM settings WHERE key = ?', [key]);
    } else {
      settings = await db.all('SELECT * FROM settings');
    }

    res.status(200).json({ status: 'success', data: settings });
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({ status: 'error', message: error.message || 'Internal server error' });
  }
}

async function updateSetting(req, res) {
  try {
    const userId = getUserIdFromToken(req);
    if (!userId) {
      return res.status(401).json({ status: 'error', message: 'Unauthorized' });
    }
    
    const { key, value } = req.body;

    if (!key || value === undefined) {
      return res.status(400).json({ status: 'error', message: 'Key and value are required' });
    }

    const db = await getDbConnection();
    // 检查设置是否存在
    const existingSetting = await db.get('SELECT * FROM settings WHERE key = ?', [key]);
    
    let setting;
    if (existingSetting) {
      // 更新现有设置
      await db.run('UPDATE settings SET value = ? WHERE key = ?', [value, key]);
      setting = { key, value };
    } else {
      // 创建新设置
      await db.run('INSERT INTO settings (key, value) VALUES (?, ?)', [key, value]);
      setting = { key, value };
    }

    res.status(200).json({ status: 'success', message: 'Setting updated successfully', data: setting });
  } catch (error) {
    console.error('Update setting error:', error);
    res.status(500).json({ status: 'error', message: error.message || 'Internal server error' });
  }
}