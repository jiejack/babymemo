// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { open } from 'sqlite';
import sqlite3 from 'sqlite3';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';
import formidable from 'formidable';

// 配置Next.js API路由
import { NextApiRequest, NextApiResponse } from 'next';

export const config = {
  api: {
    bodyParser: false, // 禁用内置的bodyParser，使用formidable处理
  },
};

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
        return getPhotoById(req, res);
      } else {
        return getPhotosHandler(req, res);
      }
    case 'POST':
      return createPhotoHandler(req, res);
    case 'PUT':
      return updatePhotoHandler(req, res);
    case 'DELETE':
      return deletePhotoHandler(req, res);
    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

async function getPhotosHandler(req, res) {
  try {
    const userId = getUserIdFromToken(req);
    if (!userId) {
      return res.status(401).json({ status: 'error', message: 'Unauthorized' });
    }
    
    // 获取数据库连接
    const db = await initDb();
    
    const { page = 1, limit = 10, category, start_date, end_date } = req.query;
    let sql = 'SELECT * FROM photos WHERE user_id = ?';
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

    sql += ' ORDER BY date DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), (parseInt(page) - 1) * parseInt(limit));

    const photos = await db.all(sql, params);
    res.status(200).json({ status: 'success', data: photos });
  } catch (error) {
    console.error('Get photos error:', error);
    res.status(500).json({ status: 'error', message: error.message || 'Internal server error' });
  }
}

async function createPhotoHandler(req, res) {
  try {
    const userId = getUserIdFromToken(req);
    if (!userId) {
      return res.status(401).json({ status: 'error', message: 'Unauthorized' });
    }
    
    // 检查是否是 multipart/form-data
    if (req.headers['content-type']?.includes('multipart/form-data')) {
      // 确保上传目录存在
      const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'photos');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      
      // 解析 multipart/form-data
      const form = formidable({
        uploadDir: uploadDir,
        keepExtensions: true,
        maxFileSize: 10 * 1024 * 1024, // 10MB
      });
      
      const [fields, files] = await form.parse(req);
      
      // 获取文件
      let photoFile = null;
      if (files.file) {
        photoFile = Array.isArray(files.file) ? files.file[0] : files.file;
      } else if (files.photo) {
        photoFile = Array.isArray(files.photo) ? files.photo[0] : files.photo;
      }
      
      if (!photoFile) {
        return res.status(400).json({ status: 'error', message: '请选择照片文件' });
      }
      
      // 验证文件
      if (!photoFile.filepath || !fs.existsSync(photoFile.filepath)) {
        console.error('Invalid file path or file not found');
        return res.status(400).json({ status: 'error', message: '文件上传无效' });
      }
      
      // 检查文件大小
      const stats = fs.statSync(photoFile.filepath);
      if (stats.size < 100) {
        console.error('File is too small, possibly corrupted:', stats.size);
        // 清理临时文件
        if (photoFile.filepath && fs.existsSync(photoFile.filepath)) {
          fs.unlinkSync(photoFile.filepath);
        }
        return res.status(400).json({ status: 'error', message: '文件太小或已损坏' });
      }
      
      // 生成唯一的文件名
      const fileExt = path.extname(photoFile.originalFilename || '.jpg') || '.jpg';
      const fileName = `photo-${Date.now()}-${uuidv4().substr(0, 8)}${fileExt}`;
      const photoPath = path.join(uploadDir, fileName);
      const photoUrl = `/uploads/photos/${fileName}`;
      
      // 移动/重命名文件
      try {
        fs.renameSync(photoFile.filepath, photoPath);
      } catch (renameErr) {
        // 如果rename失败，使用copy + delete
        console.warn('Rename failed, using copy+delete:', renameErr);
        fs.copyFileSync(photoFile.filepath, photoPath);
        fs.unlinkSync(photoFile.filepath);
      }
      
      // 验证文件是否成功保存
      if (!fs.existsSync(photoPath)) {
        return res.status(500).json({ status: 'error', message: 'Failed to save photo file' });
      }
      
      // 获取数据库连接
      const db = await initDb();
      
      // 处理字段数组问题
      const getFieldValue = (field, defaultValue = '') => {
        if (Array.isArray(field) && field.length > 0) {
          return field[0];
        }
        return field || defaultValue;
      };
      
      // 验证标题必填
      const photoTitle = getFieldValue(fields.title, '');
      if (!photoTitle.trim()) {
        // 清理临时文件
        if (photoFile.filepath && fs.existsSync(photoFile.filepath)) {
          fs.unlinkSync(photoFile.filepath);
        }
        return res.status(400).json({ status: 'error', message: '照片标题为必填项' });
      }
      
      const id = uuidv4();
      const photoDate = getFieldValue(fields.date, new Date().toISOString());
      
      await db.run(
        'INSERT INTO photos (id, user_id, baby_id, url, title, description, tags, category, date, location) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', 
        [
          id, 
          userId, 
          getFieldValue(fields.baby_id, null), 
          photoUrl, 
          photoTitle, 
          getFieldValue(fields.description, ''), 
          getFieldValue(fields.tags, ''), 
          getFieldValue(fields.category, '生活'), 
          photoDate, 
          getFieldValue(fields.location, '')
        ]
      );
      
      const newPhoto = {
        id,
        user_id: userId,
        baby_id: getFieldValue(fields.baby_id, null),
        url: photoUrl,
        title: photoTitle,
        description: getFieldValue(fields.description, ''),
        tags: getFieldValue(fields.tags, ''),
        category: getFieldValue(fields.category, '生活'),
        date: photoDate,
        location: getFieldValue(fields.location, '')
      };
      
      console.log('Photo created successfully:', newPhoto);
      res.status(201).json({ status: 'success', message: 'Photo created successfully', data: newPhoto });
    } else {
      // 处理普通 JSON 数据
      let reqBody = req.body;
      if (!reqBody) {
        // 手动解析 JSON 请求体
        let body = '';
        await new Promise((resolve, reject) => {
          req.on('data', chunk => {
            body += chunk.toString();
          });
          req.on('end', () => {
            resolve();
          });
          req.on('error', reject);
        });
        
        try {
          reqBody = JSON.parse(body) || {};
        } catch (parseError) {
          console.error('JSON parse error:', parseError);
          reqBody = {};
        }
      }
      
      // 获取数据库连接
      const db = await initDb();
      
      const { url, title, description, tags, category, date, location, baby_id } = reqBody;
      
      // 验证标题必填
      if (!title || !title.trim()) {
        return res.status(400).json({ status: 'error', message: '照片标题为必填项' });
      }
      
      const id = uuidv4();
      
      await db.run(
        'INSERT INTO photos (id, user_id, baby_id, url, title, description, tags, category, date, location) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', 
        [
          id, 
          userId, 
          baby_id, 
          url || '/uploads/photos/test-photo.jpg', 
          title, 
          description || '', 
          tags || '', 
          category || '生活', 
          date || new Date().toISOString(), 
          location || ''
        ]
      );
      
      const newPhoto = {
        id,
        user_id: userId,
        baby_id,
        url: url || '/uploads/photos/test-photo.jpg',
        title: title || '未命名照片',
        description: description || '',
        tags: tags || '',
        category: category || '生活',
        date: date || new Date().toISOString(),
        location: location || ''
      };
      
      res.status(201).json({ status: 'success', message: 'Photo created successfully', data: newPhoto });
    }
  } catch (error) {
    console.error('Create photo error:', error);
    res.status(500).json({ status: 'error', message: error.message || 'Internal server error' });
  }
}

async function deletePhotoHandler(req, res) {
  try {
    const userId = getUserIdFromToken(req);
    if (!userId) {
      return res.status(401).json({ status: 'error', message: 'Unauthorized' });
    }
    
    // 获取数据库连接
    const db = await initDb();
    
    // 获取ID，支持从路径参数或查询参数获取
    const id = req.query.id || req.query[0];
    if (!id) {
      return res.status(400).json({ status: 'error', message: 'Photo ID is required' });
    }
    
    await db.run('DELETE FROM photos WHERE id = ?', [id]);
    res.status(200).json({ status: 'success', message: 'Photo deleted successfully' });
  } catch (error) {
    console.error('Delete photo error:', error);
    res.status(500).json({ status: 'error', message: error.message || 'Internal server error' });
  }
}

async function getPhotoById(req, res) {
  try {
    const userId = getUserIdFromToken(req);
    if (!userId) {
      return res.status(401).json({ status: 'error', message: 'Unauthorized' });
    }
    
    // 获取ID，支持从路径参数或查询参数获取
    const id = req.query.id || req.query[0];
    if (!id) {
      return res.status(400).json({ status: 'error', message: 'Photo ID is required' });
    }
    
    // 获取数据库连接
    const db = await initDb();
    
    const photo = await db.get('SELECT * FROM photos WHERE id = ? AND user_id = ?', [id, userId]);
    if (!photo) {
      return res.status(404).json({ status: 'error', message: 'Photo not found' });
    }
    
    res.status(200).json({ status: 'success', data: photo });
  } catch (error) {
    console.error('Get photo error:', error);
    res.status(500).json({ status: 'error', message: error.message || 'Internal server error' });
  }
}

async function updatePhotoHandler(req, res) {
  try {
    const userId = getUserIdFromToken(req);
    if (!userId) {
      return res.status(401).json({ status: 'error', message: 'Unauthorized' });
    }
    
    // 获取ID，支持从路径参数或查询参数获取
    const id = req.query.id || req.query[0];
    if (!id) {
      return res.status(400).json({ status: 'error', message: 'Photo ID is required' });
    }
    
    // 获取数据库连接
    const db = await initDb();
    
    // 检查照片是否存在且属于当前用户
    const existingPhoto = await db.get('SELECT * FROM photos WHERE id = ? AND user_id = ?', [id, userId]);
    if (!existingPhoto) {
      return res.status(404).json({ status: 'error', message: 'Photo not found' });
    }
    
    let photoUrl = existingPhoto.url;
    let fields = {};
    
    // 检查是否是FormData上传
    if (req.headers['content-type'] && req.headers['content-type'].includes('multipart/form-data')) {
      // 确保上传目录存在
      const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'photos');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      
      const form = formidable({
        uploadDir: uploadDir,
        keepExtensions: true,
        maxFileSize: 10 * 1024 * 1024, // 10MB
      });
      
      const [parsedFields, files] = await form.parse(req);
      
      // 处理字段数组
      const getFieldValue = (field, defaultValue = '') => {
        if (Array.isArray(field) && field.length > 0) {
          return field[0];
        }
        return field || defaultValue;
      };
      
      // 获取表单字段
      fields.title = getFieldValue(parsedFields.title);
      fields.description = getFieldValue(parsedFields.description);
      fields.tags = getFieldValue(parsedFields.tags);
      fields.category = getFieldValue(parsedFields.category);
      fields.date = getFieldValue(parsedFields.date);
      fields.location = getFieldValue(parsedFields.location);
      
      // 验证标题
      if (!fields.title || !fields.title.trim()) {
        return res.status(400).json({ status: 'error', message: '照片标题为必填项' });
      }
      
      // 处理文件上传
      if (files.file || files.photo) {
        const photoFile = files.file ? (Array.isArray(files.file) ? files.file[0] : files.file) : (Array.isArray(files.photo) ? files.photo[0] : files.photo);
        
        // 验证文件
        if (!photoFile.filepath || !fs.existsSync(photoFile.filepath)) {
          return res.status(400).json({ status: 'error', message: '文件上传无效' });
        }
        
        // 检查文件大小
        const stats = fs.statSync(photoFile.filepath);
        if (stats.size < 100) {
          if (photoFile.filepath && fs.existsSync(photoFile.filepath)) {
            fs.unlinkSync(photoFile.filepath);
          }
          return res.status(400).json({ status: 'error', message: '文件太小或已损坏' });
        }
        
        // 生成新文件名
        const fileExt = path.extname(photoFile.originalFilename || '.jpg') || '.jpg';
        const fileName = `photo-${Date.now()}-${require('crypto').randomBytes(4).toString('hex')}${fileExt}`;
        const photoPath = path.join(uploadDir, fileName);
        photoUrl = `/uploads/photos/${fileName}`;
        
        // 移动文件
        try {
          fs.renameSync(photoFile.filepath, photoPath);
        } catch (renameErr) {
          fs.copyFileSync(photoFile.filepath, photoPath);
          fs.unlinkSync(photoFile.filepath);
        }
        
        // 验证文件保存成功
        if (!fs.existsSync(photoPath)) {
          return res.status(500).json({ status: 'error', message: '保存照片文件失败' });
        }
        
        // 删除旧文件
        if (existingPhoto.url && existingPhoto.url.startsWith('/uploads/')) {
          const oldPath = path.join(process.cwd(), 'public', existingPhoto.url);
          if (fs.existsSync(oldPath)) {
            fs.unlinkSync(oldPath);
          }
        }
      }
    } else {
      // 处理普通JSON数据
      let reqBody = req.body;
      if (!reqBody) {
        let body = '';
        await new Promise((resolve, reject) => {
          req.on('data', chunk => {
            body += chunk.toString();
          });
          req.on('end', () => {
            resolve();
          });
          req.on('error', reject);
        });
        
        try {
          reqBody = JSON.parse(body) || {};
        } catch (parseError) {
          reqBody = {};
        }
      }
      
      fields = reqBody;
      
      // 验证标题
      if (!fields.title || !fields.title.trim()) {
        return res.status(400).json({ status: 'error', message: '照片标题为必填项' });
      }
    }
    
    await db.run('UPDATE photos SET url = ?, title = ?, description = ?, tags = ?, category = ?, date = ?, location = ?, baby_id = ? WHERE id = ?', 
      [photoUrl, fields.title || existingPhoto.title, fields.description || existingPhoto.description, fields.tags || existingPhoto.tags, fields.category || existingPhoto.category, fields.date || existingPhoto.date, fields.location || existingPhoto.location, fields.baby_id || existingPhoto.baby_id, id]);
    
    const updatedPhoto = await db.get('SELECT * FROM photos WHERE id = ?', [id]);
    res.status(200).json({ status: 'success', message: 'Photo updated successfully', data: updatedPhoto });
  } catch (error) {
    console.error('Update photo error:', error);
    res.status(500).json({ status: 'error', message: error.message || 'Internal server error' });
  }
}