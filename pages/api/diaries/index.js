// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';

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
        return getDiaryById(req, res);
      } else {
        return getDiariesHandler(req, res);
      }
    case 'POST':
      return createDiaryHandler(req, res);
    case 'PUT':
      return updateDiaryHandler(req, res);
    case 'DELETE':
      return deleteDiaryHandler(req, res);
    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

async function getDiariesHandler(req, res) {
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
    
    const { category, start_date, end_date } = req.query;
    let sql = 'SELECT * FROM diaries WHERE user_id = ?';
    const params = [userId];

    if (category) {
      sql += ' AND category = ?';
      params.push(category);
    }

    if (start_date) {
      sql += ' AND date >= ?';
      params.push(start_date);
    }

    if (end_date) {
      sql += ' AND date <= ?';
      params.push(end_date);
    }

    sql += ' ORDER BY date DESC';

    const diaries = await db.all(sql, params);
    res.status(200).json({ status: 'success', data: diaries });
  } catch (error) {
    console.error('Get diaries error:', error);
    res.status(500).json({ status: 'error', message: error.message || 'Internal server error' });
  } finally {
    // 关闭数据库连接
    if (db) {
      await db.close();
    }
  }
}

async function createDiaryHandler(req, res) {
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
    
    const { title, content, date, category, baby_id, images, videos, mood, weather } = req.body;
    const id = uuidv4();
    
    await db.run('INSERT INTO diaries (id, user_id, baby_id, title, content, images, videos, mood, weather, date, category) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', 
      [id, userId, baby_id, title || '未命名日记', content || '', images || '', videos || '', mood || '', weather || '', date || new Date().toISOString(), category || '日常']);
    
    const newDiary = {
      id,
      user_id: userId,
      baby_id,
      title: title || '未命名日记',
      content: content || '',
      images: images || '',
      videos: videos || '',
      mood: mood || '',
      weather: weather || '',
      date: date || new Date().toISOString(),
      category: category || '日常'
    };
    
    res.status(201).json({ status: 'success', message: 'Diary created successfully', data: newDiary });
  } catch (error) {
    console.error('Create diary error:', error);
    res.status(500).json({ status: 'error', message: error.message || 'Internal server error' });
  } finally {
    // 关闭数据库连接
    if (db) {
      await db.close();
    }
  }
}

async function deleteDiaryHandler(req, res) {
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
    
    // 获取ID，支持从路径参数或查询参数获取
    const id = req.query.id || req.query[0];
    if (!id) {
      return res.status(400).json({ status: 'error', message: 'Diary ID is required' });
    }
    
    await db.run('DELETE FROM diaries WHERE id = ?', [id]);
    res.status(200).json({ status: 'success', message: 'Diary deleted successfully' });
  } catch (error) {
    console.error('Delete diary error:', error);
    res.status(500).json({ status: 'error', message: error.message || 'Internal server error' });
  } finally {
    // 关闭数据库连接
    if (db) {
      await db.close();
    }
  }
}

async function getDiaryById(req, res) {
  let db = null;
  try {
    const userId = getUserIdFromToken(req);
    if (!userId) {
      return res.status(401).json({ status: 'error', message: 'Unauthorized' });
    }
    
    // 获取ID，支持从路径参数或查询参数获取
    const id = req.query.id || req.query[0];
    if (!id) {
      return res.status(400).json({ status: 'error', message: 'Diary ID is required' });
    }
    
    // 打开数据库连接
    const dbPath = path.resolve(process.cwd(), 'data.db');
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database
    });
    
    const diary = await db.get('SELECT * FROM diaries WHERE id = ? AND user_id = ?', [id, userId]);
    if (!diary) {
      return res.status(404).json({ status: 'error', message: 'Diary not found' });
    }
    
    res.status(200).json({ status: 'success', data: diary });
  } catch (error) {
    console.error('Get diary error:', error);
    res.status(500).json({ status: 'error', message: error.message || 'Internal server error' });
  } finally {
    // 关闭数据库连接
    if (db) {
      await db.close();
    }
  }
}

async function updateDiaryHandler(req, res) {
  let db = null;
  try {
    const userId = getUserIdFromToken(req);
    if (!userId) {
      return res.status(401).json({ status: 'error', message: 'Unauthorized' });
    }
    
    // 获取ID，支持从路径参数或查询参数获取
    const id = req.query.id || req.query[0];
    if (!id) {
      return res.status(400).json({ status: 'error', message: 'Diary ID is required' });
    }
    
    // 打开数据库连接
    const dbPath = path.resolve(process.cwd(), 'data.db');
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database
    });
    
    // 检查日记是否存在且属于当前用户
    const existingDiary = await db.get('SELECT * FROM diaries WHERE id = ? AND user_id = ?', [id, userId]);
    if (!existingDiary) {
      return res.status(404).json({ status: 'error', message: 'Diary not found' });
    }
    
    const { title, content, date, category, baby_id, images, videos, mood, weather } = req.body;
    
    await db.run('UPDATE diaries SET title = ?, content = ?, date = ?, category = ?, baby_id = ?, images = ?, videos = ?, mood = ?, weather = ? WHERE id = ?', 
      [title || existingDiary.title, content || existingDiary.content, date || existingDiary.date, category || existingDiary.category, baby_id || existingDiary.baby_id, images || existingDiary.images, videos || existingDiary.videos, mood || existingDiary.mood, weather || existingDiary.weather, id]);
    
    const updatedDiary = await db.get('SELECT * FROM diaries WHERE id = ?', [id]);
    res.status(200).json({ status: 'success', message: 'Diary updated successfully', data: updatedDiary });
  } catch (error) {
    console.error('Update diary error:', error);
    res.status(500).json({ status: 'error', message: error.message || 'Internal server error' });
  } finally {
    // 关闭数据库连接
    if (db) {
      await db.close();
    }
  }
}