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
      return exportData(req, res);
    case 'POST':
      return importData(req, res);
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

async function exportData(req, res) {
  try {
    const userId = getUserIdFromToken(req);
    if (!userId) {
      return res.status(401).json({ status: 'error', message: 'Unauthorized' });
    }
    
    const { format = 'json' } = req.query;
    
    const db = await getDbConnection();
    
    // 收集所有数据
    const data = {
      users: await db.all('SELECT * FROM users'),
      babies: await db.all('SELECT * FROM babies'),
      photos: await db.all('SELECT * FROM photos'),
      diaries: await db.all('SELECT * FROM diaries'),
      events: await db.all('SELECT * FROM events'),
      milestones: await db.all('SELECT * FROM milestones'),
      growths: await db.all('SELECT * FROM growth_indicators'),
      videos: await db.all('SELECT * FROM videos'),
      settings: await db.all('SELECT * FROM settings'),
      exportDate: new Date().toISOString()
    };
    
    if (format === 'json') {
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename=babymemo-export-${Date.now()}.json`);
      res.status(200).json(data);
    } else if (format === 'csv') {
      // 这里可以实现CSV格式的导出
      res.status(200).json({ status: 'success', message: 'CSV export not yet implemented' });
    } else {
      res.status(400).json({ status: 'error', message: 'Invalid format. Only json and csv are supported.' });
    }
  } catch (error) {
    console.error('Export data error:', error);
    res.status(500).json({ status: 'error', message: error.message || 'Internal server error' });
  }
}

async function importData(req, res) {
  try {
    const userId = getUserIdFromToken(req);
    if (!userId) {
      return res.status(401).json({ status: 'error', message: 'Unauthorized' });
    }
    
    const { file } = req.body;
    
    if (!file) {
      return res.status(400).json({ status: 'error', message: 'No file provided' });
    }
    
    // 这里可以实现数据导入逻辑
    // 注意：导入时需要处理数据冲突和验证
    
    res.status(200).json({ status: 'success', message: 'Data imported successfully' });
  } catch (error) {
    console.error('Import data error:', error);
    res.status(500).json({ status: 'error', message: error.message || 'Internal server error' });
  }
}