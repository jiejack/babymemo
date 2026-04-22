import jwt from 'jsonwebtoken';
import { findByKey, findAll, upsert } from '../models/setting.js';
import { getUserIdFromToken } from '../../services/auth.js';

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
    const userId = getUserIdFromToken(req);
    if (!userId) {
      return res.status(401).json({ status: 'error', message: 'Unauthorized' });
    }
    
    const { key } = req.query;
    let settings;
    
    if (key) {
      settings = await findByKey(key);
    } else {
      settings = await findAll();
    }

    res.status(200).json({ status: 'success', data: settings });
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({ status: 'error', message: error.message || 'Internal server error' });
  }
}

async function updateSetting(req, res) {
  try {
    const userId = getUserIdFromToken(req);
    if (!userId) {
      return res.status(401).json({ status: 'error', message: 'Unauthorized' });
    }
    
    const { key, value } = req.body;

    if (!key || value === undefined) {
      return res.status(400).json({ status: 'error', message: 'Key and value are required' });
    }

    const setting = await upsert(key, value);

    res.status(200).json({ status: 'success', message: 'Setting updated successfully', data: setting });
  } catch (error) {
    console.error('Update setting error:', error);
    res.status(500).json({ status: 'error', message: error.message || 'Internal server error' });
  }
}