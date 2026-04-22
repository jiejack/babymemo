// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';

// 数据库连接池
let dbConnection = null;

// 初始化数据库连接
async function initDb() {
  if (!dbConnection) {
    const dbPath = path.resolve(process.cwd(), 'data.db');
    dbConnection = await open({
      filename: dbPath,
      driver: sqlite3.Database
    });
  }
  return dbConnection;
}

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// 从请求中获取用户ID
function getUserIdFromToken(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return null;
  }
  
  const token = authHeader.split(' ')[1];
  if (!token) {
    return null;
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded.id;
  } catch (error) {
    console.error('Token verification error:', error);
    return null;
  }
}

export default function handler(req, res) {
  // 从查询参数或路径参数中获取ID
  const id = req.query.id || req.query[0];
  
  switch (req.method) {
    case 'GET':
      if (id) {
        return getBabyById(req, res);
      } else {
        return getBabies(req, res);
      }
    case 'POST':
      return createBabyHandler(req, res);
    case 'PUT':
      return updateBabyHandler(req, res);
    case 'DELETE':
      return deleteBabyHandler(req, res);
    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

async function getBabies(req, res) {
  try {
    const userId = getUserIdFromToken(req);
    if (!userId) {
      return res.status(401).json({ status: 'error', message: 'Unauthorized' });
    }
    
    // 获取数据库连接
    const db = await initDb();
    
    const babies = await db.all('SELECT * FROM babies WHERE user_id = ?', [userId]);
    res.status(200).json({ status: 'success', data: babies });
  } catch (error) {
    console.error('Get babies error:', error);
    res.status(500).json({ status: 'error', message: error.message || 'Internal server error' });
  }
}

async function createBabyHandler(req, res) {
  try {
    const userId = getUserIdFromToken(req);
    if (!userId) {
      return res.status(401).json({ status: 'error', message: 'Unauthorized' });
    }
    
    // 获取数据库连接
    const db = await initDb();
    
    const { name, birthday, gender, avatar } = req.body;
    const id = uuidv4();
    
    await db.run('INSERT INTO babies (id, user_id, name, birthday, gender, avatar) VALUES (?, ?, ?, ?, ?, ?)', 
      [id, userId, name || '宝宝', birthday || new Date().toISOString(), gender || '未设置', avatar || 'https://via.placeholder.com/100?text=Baby']);
    
    const newBaby = {
      id,
      user_id: userId,
      name: name || '宝宝',
      birthday: birthday || new Date().toISOString(),
      gender: gender || '未设置',
      avatar: avatar || 'https://via.placeholder.com/100?text=Baby'
    };
    
    res.status(201).json({ status: 'success', message: 'Baby created successfully', data: newBaby });
  } catch (error) {
    console.error('Create baby error:', error);
    res.status(500).json({ status: 'error', message: error.message || 'Internal server error' });
  }
}

async function getBabyById(req, res) {
  try {
    const userId = getUserIdFromToken(req);
    if (!userId) {
      return res.status(401).json({ status: 'error', message: 'Unauthorized' });
    }
    
    // 获取ID，支持从路径参数或查询参数获取
    const id = req.query.id || req.query[0];
    if (!id) {
      return res.status(400).json({ status: 'error', message: 'Baby ID is required' });
    }
    
    // 获取数据库连接
    const db = await initDb();
    
    const baby = await db.get('SELECT * FROM babies WHERE id = ? AND user_id = ?', [id, userId]);
    if (!baby) {
      return res.status(404).json({ status: 'error', message: 'Baby not found' });
    }
    
    res.status(200).json({ status: 'success', data: baby });
  } catch (error) {
    console.error('Get baby error:', error);
    res.status(500).json({ status: 'error', message: error.message || 'Internal server error' });
  }
}

async function updateBabyHandler(req, res) {
  try {
    const userId = getUserIdFromToken(req);
    if (!userId) {
      return res.status(401).json({ status: 'error', message: 'Unauthorized' });
    }
    
    // 获取ID，支持从路径参数或查询参数获取
    const id = req.query.id || req.query[0];
    if (!id) {
      return res.status(400).json({ status: 'error', message: 'Baby ID is required' });
    }
    
    // 获取数据库连接
    const db = await initDb();
    
    // 检查宝宝是否存在且属于当前用户
    const existingBaby = await db.get('SELECT * FROM babies WHERE id = ? AND user_id = ?', [id, userId]);
    if (!existingBaby) {
      return res.status(404).json({ status: 'error', message: 'Baby not found' });
    }
    
    const { name, birthday, gender, avatar } = req.body;
    
    await db.run('UPDATE babies SET name = ?, birthday = ?, gender = ?, avatar = ? WHERE id = ?', 
      [name || existingBaby.name, birthday || existingBaby.birthday, gender || existingBaby.gender, avatar || existingBaby.avatar, id]);
    
    const updatedBaby = await db.get('SELECT * FROM babies WHERE id = ?', [id]);
    res.status(200).json({ status: 'success', message: 'Baby updated successfully', data: updatedBaby });
  } catch (error) {
    console.error('Update baby error:', error);
    res.status(500).json({ status: 'error', message: error.message || 'Internal server error' });
  }
}

async function deleteBabyHandler(req, res) {
  try {
    const userId = getUserIdFromToken(req);
    if (!userId) {
      return res.status(401).json({ status: 'error', message: 'Unauthorized' });
    }
    
    // 获取ID，支持从路径参数或查询参数获取
    const id = req.query.id || req.query[0];
    if (!id) {
      return res.status(400).json({ status: 'error', message: 'Baby ID is required' });
    }
    
    // 获取数据库连接
    const db = await initDb();
    
    // 检查宝宝是否存在且属于当前用户
    const existingBaby = await db.get('SELECT * FROM babies WHERE id = ? AND user_id = ?', [id, userId]);
    if (!existingBaby) {
      return res.status(404).json({ status: 'error', message: 'Baby not found' });
    }
    
    await db.run('DELETE FROM babies WHERE id = ?', [id]);
    res.status(200).json({ status: 'success', message: 'Baby deleted successfully' });
  } catch (error) {
    console.error('Delete baby error:', error);
    res.status(500).json({ status: 'error', message: error.message || 'Internal server error' });
  }
}