// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

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
  // 从查询参数或路径参数中获取ID
  const id = req.query.id || req.query[0];
  
  switch (req.method) {
    case 'GET':
      if (id) {
        return getGrowthRecordById(req, res);
      } else {
        return getGrowthRecords(req, res);
      }
    case 'POST':
      return createGrowthRecordHandler(req, res);
    case 'PUT':
      return updateGrowthRecordHandler(req, res);
    case 'DELETE':
      return deleteGrowthRecordHandler(req, res);
    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

async function getGrowthRecords(req, res) {
  try {
    const userId = getUserIdFromToken(req);
    if (!userId) {
      return res.status(401).json({ status: 'error', message: 'Unauthorized' });
    }
    
    const { baby_id, start_date, end_date } = req.query;
    if (!baby_id) {
      return res.status(400).json({ status: 'error', message: 'Baby ID is required' });
    }
    
    const db = await getDbConnection();
    let query = 'SELECT * FROM growth_indicators WHERE baby_id = ?';
    const params = [baby_id];
    
    if (start_date) {
      query += ' AND date >= ?';
      params.push(start_date);
    }
    
    if (end_date) {
      query += ' AND date <= ?';
      params.push(end_date);
    }
    
    query += ' ORDER BY date DESC';
    
    const records = await db.all(query, params);
    
    res.status(200).json({ status: 'success', data: records });
  } catch (error) {
    console.error('Get growth records error:', error);
    res.status(500).json({ status: 'error', message: error.message || 'Internal server error' });
  }
}

async function createGrowthRecordHandler(req, res) {
  try {
    const userId = getUserIdFromToken(req);
    if (!userId) {
      return res.status(401).json({ status: 'error', message: 'Unauthorized' });
    }
    
    const { baby_id, height, weight, head_circumference, date, notes } = req.body;
    if (!baby_id) {
      return res.status(400).json({ status: 'error', message: 'Baby ID is required' });
    }
    
    const db = await getDbConnection();
    const id = uuidv4();
    await db.run(
      `INSERT INTO growth_indicators (id, baby_id, height, weight, head_circumference, date, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [id, baby_id, height || null, weight || null, head_circumference || null, date || new Date().toISOString(), notes || '']
    );
    
    res.status(201).json({ status: 'success', message: 'Growth record created successfully', data: { id, baby_id, height, weight, head_circumference, date: date || new Date().toISOString(), notes: notes || '' } });
  } catch (error) {
    console.error('Create growth record error:', error);
    res.status(500).json({ status: 'error', message: error.message || 'Internal server error' });
  }
}

async function getGrowthRecordById(req, res) {
  try {
    const userId = getUserIdFromToken(req);
    if (!userId) {
      return res.status(401).json({ status: 'error', message: 'Unauthorized' });
    }
    
    const id = req.query.id || req.query[0];
    if (!id) {
      return res.status(400).json({ status: 'error', message: 'Growth record ID is required' });
    }
    
    const db = await getDbConnection();
    const record = await db.get('SELECT * FROM growth_indicators WHERE id = ?', [id]);
    if (!record) {
      return res.status(404).json({ status: 'error', message: 'Growth record not found' });
    }
    
    res.status(200).json({ status: 'success', data: record });
  } catch (error) {
    console.error('Get growth record error:', error);
    res.status(500).json({ status: 'error', message: error.message || 'Internal server error' });
  }
}

async function updateGrowthRecordHandler(req, res) {
  try {
    const userId = getUserIdFromToken(req);
    if (!userId) {
      return res.status(401).json({ status: 'error', message: 'Unauthorized' });
    }
    
    const id = req.query.id || req.query[0];
    if (!id) {
      return res.status(400).json({ status: 'error', message: 'Growth record ID is required' });
    }
    
    const db = await getDbConnection();
    
    // 检查成长记录是否存在
    const existingRecord = await db.get('SELECT * FROM growth_indicators WHERE id = ?', [id]);
    if (!existingRecord) {
      return res.status(404).json({ status: 'error', message: 'Growth record not found' });
    }
    
    const { baby_id, height, weight, head_circumference, date, notes } = req.body;
    
    await db.run(
      `UPDATE growth_indicators SET baby_id = ?, height = ?, weight = ?, head_circumference = ?, date = ?, notes = ?
       WHERE id = ?`,
      [baby_id || existingRecord.baby_id, height || existingRecord.height, weight || existingRecord.weight, head_circumference || existingRecord.head_circumference, date || existingRecord.date, notes || existingRecord.notes, id]
    );
    
    const updatedRecord = await db.get('SELECT * FROM growth_indicators WHERE id = ?', [id]);
    res.status(200).json({ status: 'success', message: 'Growth record updated successfully', data: updatedRecord });
  } catch (error) {
    console.error('Update growth record error:', error);
    res.status(500).json({ status: 'error', message: error.message || 'Internal server error' });
  }
}

async function deleteGrowthRecordHandler(req, res) {
  try {
    const userId = getUserIdFromToken(req);
    if (!userId) {
      return res.status(401).json({ status: 'error', message: 'Unauthorized' });
    }
    
    const id = req.query.id || req.query[0];
    if (!id) {
      return res.status(400).json({ status: 'error', message: 'Growth record ID is required' });
    }
    
    const db = await getDbConnection();
    
    // 检查成长记录是否存在
    const existingRecord = await db.get('SELECT * FROM growth_indicators WHERE id = ?', [id]);
    if (!existingRecord) {
      return res.status(404).json({ status: 'error', message: 'Growth record not found' });
    }
    
    await db.run('DELETE FROM growth_indicators WHERE id = ?', [id]);
    res.status(200).json({ status: 'success', message: 'Growth record deleted successfully' });
  } catch (error) {
    console.error('Delete growth record error:', error);
    res.status(500).json({ status: 'error', message: error.message || 'Internal server error' });
  }
}