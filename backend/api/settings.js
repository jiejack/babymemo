const Setting = require('../models/setting');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export default function handler(req, res) {
  const { method } = req;

  switch (method) {
    case 'GET':
      return getSettings(req, res);
    case 'POST':
      return updateSetting(req, res);
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}

async function getSettings(req, res) {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ status: 'error', message: 'No token provided' });
    }

    jwt.verify(token, JWT_SECRET);
    
    const { key } = req.query;
    let settings;
    
    if (key) {
      settings = await Setting.findByKey(key);
    } else {
      settings = await Setting.findAll();
    }

    res.status(200).json({ status: 'success', data: settings });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
}

async function updateSetting(req, res) {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ status: 'error', message: 'No token provided' });
    }

    jwt.verify(token, JWT_SECRET);
    const { key, value } = req.body;

    if (!key || value === undefined) {
      return res.status(400).json({ status: 'error', message: 'Key and value are required' });
    }

    const setting = await Setting.upsert(key, value);

    res.status(200).json({ status: 'success', message: 'Setting updated successfully', data: setting });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
}