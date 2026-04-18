const Milestone = require('../models/milestone');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export default function handler(req, res) {
  const { method } = req;

  switch (method) {
    case 'GET':
      if (req.url.includes('/')) {
        const id = req.url.split('/').pop();
        if (id && id !== 'milestones') {
          return getMilestoneById(req, res, id);
        } else {
          return getMilestones(req, res);
        }
      }
      break;
    case 'POST':
      return createMilestone(req, res);
    case 'PUT':
      const id = req.url.split('/').pop();
      if (id && id !== 'milestones') {
        return updateMilestone(req, res, id);
      }
      break;
    case 'DELETE':
      const deleteId = req.url.split('/').pop();
      if (deleteId && deleteId !== 'milestones') {
        return deleteMilestone(req, res, deleteId);
      }
      break;
    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}

async function getMilestones(req, res) {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ status: 'error', message: 'No token provided' });
    }

    jwt.verify(token, JWT_SECRET);
    
    const { page, limit, type, startDate, endDate } = req.query;
    const milestones = await Milestone.findAll(page, limit, type, startDate, endDate);

    res.status(200).json({ status: 'success', data: milestones });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
}

async function getMilestoneById(req, res, id) {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ status: 'error', message: 'No token provided' });
    }

    jwt.verify(token, JWT_SECRET);
    const milestone = await Milestone.findById(id);

    if (!milestone) {
      return res.status(404).json({ status: 'error', message: 'Milestone not found' });
    }

    res.status(200).json({ status: 'success', data: milestone });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
}

async function createMilestone(req, res) {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ status: 'error', message: 'No token provided' });
    }

    jwt.verify(token, JWT_SECRET);
    const { title, description, date, type, images, tags } = req.body;

    const milestone = await Milestone.create(title, description, date, type, images, tags);

    res.status(201).json({ status: 'success', message: 'Milestone created successfully', data: milestone });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
}

async function updateMilestone(req, res, id) {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ status: 'error', message: 'No token provided' });
    }

    jwt.verify(token, JWT_SECRET);
    const { title, description, date, type, images, tags } = req.body;

    const existingMilestone = await Milestone.findById(id);
    if (!existingMilestone) {
      return res.status(404).json({ status: 'error', message: 'Milestone not found' });
    }

    const updatedMilestone = await Milestone.update(id, { title, description, date, type, images, tags });

    res.status(200).json({ status: 'success', message: 'Milestone updated successfully', data: updatedMilestone });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
}

async function deleteMilestone(req, res, id) {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ status: 'error', message: 'No token provided' });
    }

    jwt.verify(token, JWT_SECRET);

    const existingMilestone = await Milestone.findById(id);
    if (!existingMilestone) {
      return res.status(404).json({ status: 'error', message: 'Milestone not found' });
    }

    await Milestone.delete(id);

    res.status(200).json({ status: 'success', message: 'Milestone deleted successfully' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
}