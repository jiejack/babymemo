// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import formidable from 'formidable';
import crypto from 'crypto';

// 配置Next.js API路由
export const config = {
  api: {
    bodyParser: false, // 禁用内置的bodyParser，使用formidable处理
  },
};

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
        return getVideoById(req, res);
      } else {
        return getVideosHandler(req, res);
      }
    case 'POST':
      // 检查是否是文件上传
      if (req.headers['content-type']?.includes('multipart/form-data')) {
        return uploadVideoHandler(req, res);
      } else {
        return createVideoHandler(req, res);
      }
    case 'PUT':
      // 检查是否是文件上传
      if (req.headers['content-type']?.includes('multipart/form-data')) {
        return updateVideoWithFileHandler(req, res);
      } else {
        return updateVideoHandler(req, res);
      }
    case 'DELETE':
      return deleteVideoHandler(req, res);
    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

async function getVideosHandler(req, res) {
  try {
    const userId = getUserIdFromToken(req);
    if (!userId) {
      return res.status(401).json({ status: 'error', message: 'Unauthorized' });
    }
    
    const { page = 1, limit = 10, category, start_date, end_date, baby_id } = req.query;
    
    const db = await getDbConnection();
    let query = 'SELECT * FROM videos WHERE user_id = ?';
    const params = [userId];
    
    if (baby_id) {
      query += ' AND baby_id = ?';
      params.push(baby_id);
    }
    
    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }
    
    if (start_date) {
      query += ' AND date >= ?';
      params.push(start_date);
    }
    
    if (end_date) {
      query += ' AND date <= ?';
      params.push(end_date);
    }
    
    query += ' ORDER BY date DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), (parseInt(page) - 1) * parseInt(limit));
    
    const videos = await db.all(query, params);
    
    res.status(200).json({ status: 'success', data: videos });
  } catch (error) {
    console.error('Get videos error:', error);
    res.status(500).json({ status: 'error', message: error.message || 'Internal server error' });
  }
}

async function createVideoHandler(req, res) {
  try {
    const userId = getUserIdFromToken(req);
    if (!userId) {
      return res.status(401).json({ status: 'error', message: 'Unauthorized' });
    }
    
    const { url, title, description, tags, category, date, duration, thumbnail, baby_id } = req.body;
    
    const db = await getDbConnection();
    const id = uuidv4();
    await db.run(
      `INSERT INTO videos (id, user_id, baby_id, url, title, description, tags, category, date, duration, thumbnail)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, userId, baby_id, url || '', title || '未命名视频', description || '', tags || '', category || '生活', date || new Date().toISOString(), duration || 0, thumbnail || '']
    );
    
    res.status(201).json({ status: 'success', message: 'Video created successfully', data: { id, user_id: userId, baby_id, url, title, description, tags, category, date: date || new Date().toISOString(), duration, thumbnail } });
  } catch (error) {
    console.error('Create video error:', error);
    res.status(500).json({ status: 'error', message: error.message || 'Internal server error' });
  }
}

async function getVideoById(req, res) {
  try {
    const userId = getUserIdFromToken(req);
    if (!userId) {
      return res.status(401).json({ status: 'error', message: 'Unauthorized' });
    }
    
    const id = req.query.id || req.query[0];
    if (!id) {
      return res.status(400).json({ status: 'error', message: 'Video ID is required' });
    }
    
    const db = await getDbConnection();
    const video = await db.get('SELECT * FROM videos WHERE id = ? AND user_id = ?', [id, userId]);
    if (!video) {
      return res.status(404).json({ status: 'error', message: 'Video not found' });
    }
    
    res.status(200).json({ status: 'success', data: video });
  } catch (error) {
    console.error('Get video error:', error);
    res.status(500).json({ status: 'error', message: error.message || 'Internal server error' });
  }
}

async function updateVideoHandler(req, res) {
  try {
    const userId = getUserIdFromToken(req);
    if (!userId) {
      return res.status(401).json({ status: 'error', message: 'Unauthorized' });
    }
    
    const id = req.query.id || req.query[0];
    if (!id) {
      return res.status(400).json({ status: 'error', message: 'Video ID is required' });
    }
    
    const db = await getDbConnection();
    
    // 检查视频是否存在且属于当前用户
    const existingVideo = await db.get('SELECT * FROM videos WHERE id = ? AND user_id = ?', [id, userId]);
    if (!existingVideo) {
      return res.status(404).json({ status: 'error', message: 'Video not found' });
    }
    
    const { url, title, description, tags, category, date, duration, thumbnail, baby_id } = req.body;
    
    await db.run(
      `UPDATE videos SET url = ?, title = ?, description = ?, tags = ?, category = ?, date = ?, duration = ?, thumbnail = ?, baby_id = ?
       WHERE id = ?`,
      [url || existingVideo.url, title || existingVideo.title, description || existingVideo.description, tags || existingVideo.tags, category || existingVideo.category, date || existingVideo.date, duration || existingVideo.duration, thumbnail || existingVideo.thumbnail, baby_id || existingVideo.baby_id, id]
    );
    
    const updatedVideo = await db.get('SELECT * FROM videos WHERE id = ?', [id]);
    res.status(200).json({ status: 'success', message: 'Video updated successfully', data: updatedVideo });
  } catch (error) {
    console.error('Update video error:', error);
    res.status(500).json({ status: 'error', message: error.message || 'Internal server error' });
  }
}

async function deleteVideoHandler(req, res) {
  try {
    const userId = getUserIdFromToken(req);
    if (!userId) {
      return res.status(401).json({ status: 'error', message: 'Unauthorized' });
    }
    
    const id = req.query.id || req.query[0];
    if (!id) {
      return res.status(400).json({ status: 'error', message: 'Video ID is required' });
    }
    
    const db = await getDbConnection();
    
    // 检查视频是否存在且属于当前用户
    const existingVideo = await db.get('SELECT * FROM videos WHERE id = ? AND user_id = ?', [id, userId]);
    if (!existingVideo) {
      return res.status(404).json({ status: 'error', message: 'Video not found' });
    }
    
    // 删除视频文件
    if (existingVideo.url && existingVideo.url.startsWith('/uploads/')) {
      const videoPath = path.join(process.cwd(), existingVideo.url);
      if (fs.existsSync(videoPath)) {
        try {
          fs.unlinkSync(videoPath);
        } catch (error) {
          console.error('Error deleting video file:', error);
        }
      }
    }
    
    await db.run('DELETE FROM videos WHERE id = ?', [id]);
    res.status(200).json({ status: 'success', message: 'Video deleted successfully' });
  } catch (error) {
    console.error('Delete video error:', error);
    res.status(500).json({ status: 'error', message: error.message || 'Internal server error' });
  }
}

async function uploadVideoHandler(req, res) {
  try {
    const userId = getUserIdFromToken(req);
    if (!userId) {
      return res.status(401).json({ status: 'error', message: '未授权' });
    }
    
    // 确保上传目录存在
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'videos');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    // 解析 multipart/form-data
    const form = formidable({
      uploadDir: uploadDir,
      keepExtensions: true,
      maxFileSize: 100 * 1024 * 1024, // 100MB
    });
    
    const [fields, files] = await form.parse(req);
    
    // 处理字段数组
    const getFieldValue = (field, defaultValue = '') => {
      if (Array.isArray(field) && field.length > 0) {
        return field[0];
      }
      return field || defaultValue;
    };
    
    // 获取文件
    let videoFile = null;
    if (files.video) {
      videoFile = Array.isArray(files.video) ? files.video[0] : files.video;
    } else if (files.file) {
      videoFile = Array.isArray(files.file) ? files.file[0] : files.file;
    }
    
    if (!videoFile) {
      return res.status(400).json({ status: 'error', message: '请选择视频文件' });
    }
    
    // 验证文件
    if (!videoFile.filepath || !fs.existsSync(videoFile.filepath)) {
      console.error('无效的文件路径或文件不存在');
      return res.status(400).json({ status: 'error', message: '文件上传无效' });
    }
    
    // 检查文件大小
    const stats = fs.statSync(videoFile.filepath);
    if (stats.size < 100) {
      console.error('文件太小，可能已损坏:', stats.size);
      if (videoFile.filepath && fs.existsSync(videoFile.filepath)) {
        fs.unlinkSync(videoFile.filepath);
      }
      return res.status(400).json({ status: 'error', message: '文件太小或已损坏' });
    }
    
    // 检查文件类型
    const fileName = videoFile.originalFilename || '';
    const fileExt = path.extname(fileName).toLowerCase();
    const allowedExts = ['.mp4', '.mov', '.avi', '.wmv', '.flv', '.mkv', '.webm'];
    if (!allowedExts.includes(fileExt)) {
      if (videoFile.filepath && fs.existsSync(videoFile.filepath)) {
        fs.unlinkSync(videoFile.filepath);
      }
      return res.status(400).json({ status: 'error', message: '不支持的视频格式' });
    }
    
    // 生成唯一的文件名
    const uniqueFileName = `video-${Date.now()}-${crypto.randomBytes(4).toString('hex')}${fileExt}`;
    const videoPath = path.join(uploadDir, uniqueFileName);
    const videoUrl = `/uploads/videos/${uniqueFileName}`;
    
    // 移动上传的文件
    try {
      fs.renameSync(videoFile.filepath, videoPath);
    } catch (renameErr) {
      // 如果rename失败，使用copy + delete
      console.warn('Rename失败，使用copy+delete:', renameErr);
      fs.copyFileSync(videoFile.filepath, videoPath);
      fs.unlinkSync(videoFile.filepath);
    }
    
    // 验证文件保存成功
    if (!fs.existsSync(videoPath)) {
      return res.status(500).json({ status: 'error', message: '保存视频文件失败' });
    }
    
    // 验证标题
    const title = getFieldValue(fields.title);
    if (!title || !title.trim()) {
      // 清理已上传的文件
      if (fs.existsSync(videoPath)) {
        fs.unlinkSync(videoPath);
      }
      return res.status(400).json({ status: 'error', message: '视频标题为必填项' });
    }
    
    // 保存视频信息到数据库
    const db = await getDbConnection();
    const id = uuidv4();
    await db.run(
      `INSERT INTO videos (id, user_id, baby_id, url, title, description, tags, category, date, duration, thumbnail)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        userId,
        getFieldValue(fields.baby_id, null),
        videoUrl,
        title,
        getFieldValue(fields.description, ''),
        getFieldValue(fields.tags, ''),
        getFieldValue(fields.category, '生活'),
        getFieldValue(fields.date, new Date().toISOString()),
        getFieldValue(fields.duration, 0),
        getFieldValue(fields.thumbnail, '')
      ]
    );
    
    res.status(201).json({ 
      status: 'success', 
      message: '视频上传成功', 
      data: { 
        id,
        user_id: userId, 
        baby_id: getFieldValue(fields.baby_id, null),
        url: videoUrl,
        title: title,
        description: getFieldValue(fields.description, ''),
        tags: getFieldValue(fields.tags, ''),
        category: getFieldValue(fields.category, '生活'),
        date: getFieldValue(fields.date, new Date().toISOString()),
        duration: getFieldValue(fields.duration, 0),
        thumbnail: getFieldValue(fields.thumbnail, '')
      } 
    });
  } catch (error) {
    console.error('Upload video error:', error);
    res.status(500).json({ status: 'error', message: error.message || '服务器内部错误' });
  }
}

async function updateVideoWithFileHandler(req, res) {
  try {
    const userId = getUserIdFromToken(req);
    if (!userId) {
      return res.status(401).json({ status: 'error', message: '未授权' });
    }
    
    const id = req.query.id || req.query[0];
    if (!id) {
      return res.status(400).json({ status: 'error', message: '视频ID是必需的' });
    }
    
    // 确保上传目录存在
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'videos');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    // 解析 multipart/form-data
    const form = formidable({
      uploadDir: uploadDir,
      keepExtensions: true,
      maxFileSize: 100 * 1024 * 1024, // 100MB
    });
    
    const [fields, files] = await form.parse(req);
    
    // 处理字段数组
    const getFieldValue = (field, defaultValue = '') => {
      if (Array.isArray(field) && field.length > 0) {
        return field[0];
      }
      return field || defaultValue;
    };
    
    // 检查视频是否存在且属于当前用户
    const db = await getDbConnection();
    const existingVideo = await db.get('SELECT * FROM videos WHERE id = ? AND user_id = ?', [id, userId]);
    if (!existingVideo) {
      // 清理上传的文件
      if (files.video) {
        const videoFile = Array.isArray(files.video) ? files.video[0] : files.video;
        if (videoFile.filepath && fs.existsSync(videoFile.filepath)) {
          fs.unlinkSync(videoFile.filepath);
        }
      }
      return res.status(404).json({ status: 'error', message: '视频不存在' });
    }
    
    // 验证标题
    const title = getFieldValue(fields.title);
    if (!title || !title.trim()) {
      // 清理上传的文件
      if (files.video) {
        const videoFile = Array.isArray(files.video) ? files.video[0] : files.video;
        if (videoFile.filepath && fs.existsSync(videoFile.filepath)) {
          fs.unlinkSync(videoFile.filepath);
        }
      }
      return res.status(400).json({ status: 'error', message: '视频标题为必填项' });
    }
    
    let videoUrl = existingVideo.url;
    
    // 处理文件上传
    if (files.video) {
      const videoFile = Array.isArray(files.video) ? files.video[0] : files.video;
      
      // 验证文件
      if (!videoFile.filepath || !fs.existsSync(videoFile.filepath)) {
        console.error('无效的文件路径或文件不存在');
        return res.status(400).json({ status: 'error', message: '文件上传无效' });
      }
      
      // 检查文件大小
      const stats = fs.statSync(videoFile.filepath);
      if (stats.size < 100) {
        console.error('文件太小，可能已损坏:', stats.size);
        if (videoFile.filepath && fs.existsSync(videoFile.filepath)) {
          fs.unlinkSync(videoFile.filepath);
        }
        return res.status(400).json({ status: 'error', message: '文件太小或已损坏' });
      }
      
      // 检查文件类型
      const fileName = videoFile.originalFilename || '';
      const fileExt = path.extname(fileName).toLowerCase();
      const allowedExts = ['.mp4', '.mov', '.avi', '.wmv', '.flv', '.mkv', '.webm'];
      if (!allowedExts.includes(fileExt)) {
        if (videoFile.filepath && fs.existsSync(videoFile.filepath)) {
          fs.unlinkSync(videoFile.filepath);
        }
        return res.status(400).json({ status: 'error', message: '不支持的视频格式' });
      }
      
      // 生成唯一的文件名
      const uniqueFileName = `video-${Date.now()}-${require('crypto').randomBytes(4).toString('hex')}${fileExt}`;
      const videoPath = path.join(uploadDir, uniqueFileName);
      videoUrl = `/uploads/videos/${uniqueFileName}`;
      
      // 移动上传的文件
      try {
        fs.renameSync(videoFile.filepath, videoPath);
      } catch (renameErr) {
        // 如果rename失败，使用copy + delete
        console.warn('Rename失败，使用copy+delete:', renameErr);
        fs.copyFileSync(videoFile.filepath, videoPath);
        fs.unlinkSync(videoFile.filepath);
      }
      
      // 验证文件保存成功
      if (!fs.existsSync(videoPath)) {
        return res.status(500).json({ status: 'error', message: '保存视频文件失败' });
      }
      
      // 删除旧视频文件
      if (existingVideo.url && existingVideo.url.startsWith('/uploads/')) {
        const oldVideoPath = path.join(process.cwd(), existingVideo.url);
        if (fs.existsSync(oldVideoPath)) {
          try {
            fs.unlinkSync(oldVideoPath);
          } catch (error) {
            console.error('删除旧视频文件失败:', error);
          }
        }
      }
    }
    
    // 更新数据库记录
    await db.run(
      `UPDATE videos SET url = ?, title = ?, description = ?, tags = ?, category = ?, date = ?, duration = ?, thumbnail = ?, baby_id = ?
       WHERE id = ?`,
      [
        videoUrl,
        title,
        getFieldValue(fields.description, existingVideo.description || ''),
        getFieldValue(fields.tags, existingVideo.tags || ''),
        getFieldValue(fields.category, existingVideo.category || '生活'),
        getFieldValue(fields.date, existingVideo.date || new Date().toISOString()),
        getFieldValue(fields.duration, existingVideo.duration || 0),
        getFieldValue(fields.thumbnail, existingVideo.thumbnail || ''),
        getFieldValue(fields.baby_id, existingVideo.baby_id || null),
        id
      ]
    );
    
    const updatedVideo = await db.get('SELECT * FROM videos WHERE id = ?', [id]);
    res.status(200).json({ status: 'success', message: '视频更新成功', data: updatedVideo });
  } catch (error) {
    console.error('Update video with file error:', error);
    res.status(500).json({ status: 'error', message: error.message || '服务器内部错误' });
  }
}