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
        return getEventById(req, res);
      } else {
        return getEventsHandler(req, res);
      }
    case 'POST':
      return createEventHandler(req, res);
    case 'PUT':
      return updateEventHandler(req, res);
    case 'DELETE':
      return deleteEventHandler(req, res);
    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

async function getEventsHandler(req, res) {
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
    
    const { start_date, end_date } = req.query;
    let sql = 'SELECT * FROM events WHERE user_id = ?';
    const params = [userId];

    if (start_date) {
      sql += ' AND date >= ?';
      params.push(start_date);
    }

    if (end_date) {
      sql += ' AND date <= ?';
      params.push(end_date);
    }

    sql += ' ORDER BY date ASC';

    const events = await db.all(sql, params);
    res.status(200).json({ status: 'success', data: events });
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({ status: 'error', message: error.message || 'Internal server error' });
  } finally {
    // 关闭数据库连接
    if (db) {
      await db.close();
    }
  }
}

async function createEventHandler(req, res) {
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
    
    const { title, description, date, type, color, baby_id, reminder, repeat } = req.body;
    const id = uuidv4();
    
    await db.run('INSERT INTO events (id, user_id, baby_id, title, description, date, type, color, reminder, repeat) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', 
      [id, userId, baby_id, title || '未命名事件', description || '', date || new Date().toISOString(), type || '重要', color || '#3b82f6', reminder || 0, repeat || '']);
    
    const newEvent = {
      id,
      user_id: userId,
      baby_id,
      title: title || '未命名事件',
      description: description || '',
      date: date || new Date().toISOString(),
      type: type || '重要',
      color: color || '#3b82f6',
      reminder: reminder || 0,
      repeat: repeat || ''
    };
    
    res.status(201).json({ status: 'success', message: 'Event created successfully', data: newEvent });
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({ status: 'error', message: error.message || 'Internal server error' });
  } finally {
    // 关闭数据库连接
    if (db) {
      await db.close();
    }
  }
}

async function getEventById(req, res) {
  let db = null;
  try {
    const userId = getUserIdFromToken(req);
    if (!userId) {
      return res.status(401).json({ status: 'error', message: 'Unauthorized' });
    }
    
    const id = req.query.id || req.query[0];
    if (!id) {
      return res.status(400).json({ status: 'error', message: 'Event ID is required' });
    }
    
    // 打开数据库连接
    const dbPath = path.resolve(process.cwd(), 'data.db');
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database
    });
    
    const event = await db.get('SELECT * FROM events WHERE id = ? AND user_id = ?', [id, userId]);
    if (!event) {
      return res.status(404).json({ status: 'error', message: 'Event not found' });
    }
    
    res.status(200).json({ status: 'success', data: event });
  } catch (error) {
    console.error('Get event error:', error);
    res.status(500).json({ status: 'error', message: error.message || 'Internal server error' });
  } finally {
    // 关闭数据库连接
    if (db) {
      await db.close();
    }
  }
}

async function updateEventHandler(req, res) {
  let db = null;
  try {
    const userId = getUserIdFromToken(req);
    if (!userId) {
      return res.status(401).json({ status: 'error', message: 'Unauthorized' });
    }
    
    const id = req.query.id || req.query[0];
    if (!id) {
      return res.status(400).json({ status: 'error', message: 'Event ID is required' });
    }
    
    // 打开数据库连接
    const dbPath = path.resolve(process.cwd(), 'data.db');
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database
    });
    
    // 检查事件是否存在且属于当前用户
    const existingEvent = await db.get('SELECT * FROM events WHERE id = ? AND user_id = ?', [id, userId]);
    if (!existingEvent) {
      return res.status(404).json({ status: 'error', message: 'Event not found' });
    }
    
    const { title, description, date, type, color, baby_id, reminder, repeat } = req.body;
    
    await db.run('UPDATE events SET title = ?, description = ?, date = ?, type = ?, color = ?, baby_id = ?, reminder = ?, repeat = ? WHERE id = ?', 
      [title || existingEvent.title, description || existingEvent.description, date || existingEvent.date, type || existingEvent.type, color || existingEvent.color, baby_id || existingEvent.baby_id, reminder || existingEvent.reminder, repeat || existingEvent.repeat, id]);
    
    const updatedEvent = await db.get('SELECT * FROM events WHERE id = ?', [id]);
    res.status(200).json({ status: 'success', message: 'Event updated successfully', data: updatedEvent });
  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({ status: 'error', message: error.message || 'Internal server error' });
  } finally {
    // 关闭数据库连接
    if (db) {
      await db.close();
    }
  }
}

async function deleteEventHandler(req, res) {
  let db = null;
  try {
    const userId = getUserIdFromToken(req);
    if (!userId) {
      return res.status(401).json({ status: 'error', message: 'Unauthorized' });
    }
    
    const id = req.query.id || req.query[0];
    if (!id) {
      return res.status(400).json({ status: 'error', message: 'Event ID is required' });
    }
    
    // 打开数据库连接
    const dbPath = path.resolve(process.cwd(), 'data.db');
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database
    });
    
    // 检查事件是否存在且属于当前用户
    const existingEvent = await db.get('SELECT * FROM events WHERE id = ? AND user_id = ?', [id, userId]);
    if (!existingEvent) {
      return res.status(404).json({ status: 'error', message: 'Event not found' });
    }
    
    await db.run('DELETE FROM events WHERE id = ?', [id]);
    res.status(200).json({ status: 'success', message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({ status: 'error', message: error.message || 'Internal server error' });
  } finally {
    // 关闭数据库连接
    if (db) {
      await db.close();
    }
  }
}