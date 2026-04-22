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
        return getMilestoneById(req, res);
      } else {
        return getMilestonesHandler(req, res);
      }
    case 'POST':
      return createMilestoneHandler(req, res);
    case 'PUT':
      return updateMilestoneHandler(req, res);
    case 'DELETE':
      return deleteMilestoneHandler(req, res);
    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

async function getMilestonesHandler(req, res) {
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
    
    const { type, start_date, end_date } = req.query;
    let sql = 'SELECT * FROM milestones WHERE user_id = ?';
    const params = [userId];

    if (type) {
      sql += ' AND type = ?';
      params.push(type);
    }

    if (start_date) {
      sql += ' AND date >= ?';
      params.push(start_date);
    }

    if (end_date) {
      sql += ' AND date <= ?';
      params.push(end_date);
    }

    // 获取所有里程碑后在代码中排序，确保日期格式一致
    let milestones = await db.all(sql.replace(' ORDER BY datetime(date) DESC, created_at DESC', ''), params);
    
    // 在代码中排序，确保日期格式一致
    milestones.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      const dateDiff = dateB - dateA;
      if (dateDiff !== 0) {
        return dateDiff;
      }
      return new Date(b.created_at) - new Date(a.created_at);
    });
    
    res.status(200).json({ status: 'success', data: milestones });
  } catch (error) {
    console.error('Get milestones error:', error);
    res.status(500).json({ status: 'error', message: error.message || 'Internal server error' });
  } finally {
    // 关闭数据库连接
    if (db) {
      await db.close();
    }
  }
}

async function createMilestoneHandler(req, res) {
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
    
    const { title, description, date, type, baby_id, images, tags } = req.body;
    const id = uuidv4();
    
    // 统一日期格式为ISO格式
    const normalizedDate = date ? new Date(date).toISOString() : new Date().toISOString();
    
    await db.run('INSERT INTO milestones (id, user_id, baby_id, title, description, date, type, images, tags) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', 
      [id, userId, baby_id, title || '未命名里程碑', description || '', normalizedDate, type || '成长', images || '', tags || '']);
    
    // 获取刚创建的完整里程碑数据
    const newMilestone = await db.get('SELECT * FROM milestones WHERE id = ?', [id]);
    
    res.status(201).json({ status: 'success', message: 'Milestone created successfully', data: newMilestone });
  } catch (error) {
    console.error('Create milestone error:', error);
    res.status(500).json({ status: 'error', message: error.message || 'Internal server error' });
  } finally {
    // 关闭数据库连接
    if (db) {
      await db.close();
    }
  }
}

async function deleteMilestoneHandler(req, res) {
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
    
    const id = req.query.id || req.query[0];
    if (!id) {
      return res.status(400).json({ status: 'error', message: 'Milestone ID is required' });
    }
    
    await db.run('DELETE FROM milestones WHERE id = ?', [id]);
    res.status(200).json({ status: 'success', message: 'Milestone deleted successfully' });
  } catch (error) {
    console.error('Delete milestone error:', error);
    res.status(500).json({ status: 'error', message: error.message || 'Internal server error' });
  } finally {
    // 关闭数据库连接
    if (db) {
      await db.close();
    }
  }
}

async function getMilestoneById(req, res) {
  let db = null;
  try {
    const userId = getUserIdFromToken(req);
    if (!userId) {
      return res.status(401).json({ status: 'error', message: 'Unauthorized' });
    }
    
    const id = req.query.id || req.query[0];
    if (!id) {
      return res.status(400).json({ status: 'error', message: 'Milestone ID is required' });
    }
    
    // 打开数据库连接
    const dbPath = path.resolve(process.cwd(), 'data.db');
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database
    });
    
    const milestone = await db.get('SELECT * FROM milestones WHERE id = ? AND user_id = ?', [id, userId]);
    if (!milestone) {
      return res.status(404).json({ status: 'error', message: 'Milestone not found' });
    }
    
    res.status(200).json({ status: 'success', data: milestone });
  } catch (error) {
    console.error('Get milestone error:', error);
    res.status(500).json({ status: 'error', message: error.message || 'Internal server error' });
  } finally {
    // 关闭数据库连接
    if (db) {
      await db.close();
    }
  }
}

async function updateMilestoneHandler(req, res) {
  let db = null;
  try {
    const userId = getUserIdFromToken(req);
    if (!userId) {
      return res.status(401).json({ status: 'error', message: 'Unauthorized' });
    }
    
    const id = req.query.id || req.query[0];
    if (!id) {
      return res.status(400).json({ status: 'error', message: 'Milestone ID is required' });
    }
    
    // 打开数据库连接
    const dbPath = path.resolve(process.cwd(), 'data.db');
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database
    });
    
    // 检查里程碑是否存在且属于当前用户
    const existingMilestone = await db.get('SELECT * FROM milestones WHERE id = ? AND user_id = ?', [id, userId]);
    if (!existingMilestone) {
      return res.status(404).json({ status: 'error', message: 'Milestone not found' });
    }
    
    const { title, description, date, type, baby_id, images, tags } = req.body;
    
    // 统一日期格式为ISO格式
    const normalizedDate = date ? new Date(date).toISOString() : existingMilestone.date;
    
    await db.run('UPDATE milestones SET title = ?, description = ?, date = ?, type = ?, baby_id = ?, images = ?, tags = ? WHERE id = ?', 
      [title || existingMilestone.title, description || existingMilestone.description, normalizedDate, type || existingMilestone.type, baby_id || existingMilestone.baby_id, images || existingMilestone.images, tags || existingMilestone.tags, id]);
    
    const updatedMilestone = await db.get('SELECT * FROM milestones WHERE id = ?', [id]);
    res.status(200).json({ status: 'success', message: 'Milestone updated successfully', data: updatedMilestone });
  } catch (error) {
    console.error('Update milestone error:', error);
    res.status(500).json({ status: 'error', message: error.message || 'Internal server error' });
  } finally {
    // 关闭数据库连接
    if (db) {
      await db.close();
    }
  }
}