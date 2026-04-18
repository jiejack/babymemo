const Growth = require('../models/growth');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export default function handler(req, res) {
  const { method } = req;

  switch (method) {
    case 'GET':
      if (req.url.includes('/')) {
        const id = req.url.split('/').pop();
        if (id && id !== 'growth') {
          return getGrowthById(req, res, id);
        } else {
          return getGrowths(req, res);
        }
      }
      break;
    case 'POST':
      return createGrowth(req, res);
    case 'PUT':
      const id = req.url.split('/').pop();
      if (id && id !== 'growth') {
        return updateGrowth(req, res, id);
      }
      break;
    case 'DELETE':
      const deleteId = req.url.split('/').pop();
      if (deleteId && deleteId !== 'growth') {
        return deleteGrowth(req, res, deleteId);
      }
      break;
    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}

async function getGrowths(req, res) {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ status: 'error', message: 'No token provided' });
    }

    jwt.verify(token, JWT_SECRET);
    
    const { baby_id, startDate, endDate } = req.query;
    const growths = await Growth.findAll(baby_id, startDate, endDate);

    res.status(200).json({ status: 'success', data: growths });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
}

async function getGrowthById(req, res, id) {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ status: 'error', message: 'No token provided' });
    }

    jwt.verify(token, JWT_SECRET);
    const growth = await Growth.findById(id);

    if (!growth) {
      return res.status(404).json({ status: 'error', message: 'Growth record not found' });
    }

    res.status(200).json({ status: 'success', data: growth });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
}

async function createGrowth(req, res) {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ status: 'error', message: 'No token provided' });
    }

    jwt.verify(token, JWT_SECRET);
    const { baby_id, height, weight, head_circumference, date, notes } = req.body;

    if (!baby_id || !date) {
      return res.status(400).json({ status: 'error', message: 'Baby ID and date are required' });
    }

    const growth = await Growth.create(baby_id, height, weight, head_circumference, date, notes);

    res.status(201).json({ status: 'success', message: 'Growth record created successfully', data: growth });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
}

async function updateGrowth(req, res, id) {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ status: 'error', message: 'No token provided' });
    }

    jwt.verify(token, JWT_SECRET);
    const { baby_id, height, weight, head_circumference, date, notes } = req.body;

    const existingGrowth = await Growth.findById(id);
    if (!existingGrowth) {
      return res.status(404).json({ status: 'error', message: 'Growth record not found' });
    }

    const updatedGrowth = await Growth.update(id, { baby_id, height, weight, head_circumference, date, notes });

    res.status(200).json({ status: 'success', message: 'Growth record updated successfully', data: updatedGrowth });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
}

async function deleteGrowth(req, res, id) {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ status: 'error', message: 'No token provided' });
    }

    jwt.verify(token, JWT_SECRET);

    const existingGrowth = await Growth.findById(id);
    if (!existingGrowth) {
      return res.status(404).json({ status: 'error', message: 'Growth record not found' });
    }

    await Growth.delete(id);

    res.status(200).json({ status: 'success', message: 'Growth record deleted successfully' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
}