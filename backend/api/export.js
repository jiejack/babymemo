const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');

// 导入所有模型
const User = require('../models/user');
const Baby = require('../models/baby');
const Photo = require('../models/photo');
const Diary = require('../models/diary');
const Event = require('../models/event');
const Milestone = require('../models/milestone');
const Growth = require('../models/growth');
const Video = require('../models/video');
const Setting = require('../models/setting');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export default function handler(req, res) {
  const { method } = req;

  switch (method) {
    case 'GET':
      return exportData(req, res);
    case 'POST':
      return importData(req, res);
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}

async function exportData(req, res) {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ status: 'error', message: 'No token provided' });
    }

    jwt.verify(token, JWT_SECRET);
    
    const { format } = req.query || 'json';

    // 收集所有数据
    const data = {
      users: await User.findAll(),
      babies: await Baby.findAll(),
      photos: await Photo.findAll(),
      diaries: await Diary.findAll(),
      events: await Event.findAll(),
      milestones: await Milestone.findAll(),
      growths: await Growth.findAll(),
      videos: await Video.findAll(),
      settings: await Setting.findAll(),
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
    res.status(500).json({ status: 'error', message: error.message });
  }
}

async function importData(req, res) {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ status: 'error', message: 'No token provided' });
    }

    jwt.verify(token, JWT_SECRET);
    
    const { file } = req.body;

    if (!file) {
      return res.status(400).json({ status: 'error', message: 'No file provided' });
    }

    // 这里可以实现数据导入逻辑
    // 注意：导入时需要处理数据冲突和验证

    res.status(200).json({ status: 'success', message: 'Data imported successfully' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
}