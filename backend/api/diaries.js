const Diary = require('../models/diary');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export default function handler(req, res) {
  const { method } = req;

  switch (method) {
    case 'GET':
      if (req.url.includes('/')) {
        const id = req.url.split('/').pop();
        if (id && id !== 'diaries') {
          return getDiaryById(req, res, id);
        } else {
          return getDiaries(req, res);
        }
      }
      break;
    case 'POST':
      return createDiary(req, res);
    case 'PUT':
      const id = req.url.split('/').pop();
      if (id && id !== 'diaries') {
        return updateDiary(req, res, id);
      }
      break;
    case 'DELETE':
      const deleteId = req.url.split('/').pop();
      if (deleteId && deleteId !== 'diaries') {
        return deleteDiary(req, res, deleteId);
      }
      break;
    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}

async function getDiaries(req, res) {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ status: 'error', message: 'No token provided' });
    }

    jwt.verify(token, JWT_SECRET);
    
    const { page = 1, limit = 10, category, startDate, endDate } = req.query;
    const diaries = await Diary.findAll(
      parseInt(page),
      parseInt(limit),
      category,
      startDate,
      endDate
    );

    res.status(200).json({ status: 'success', data: diaries });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
}

async function getDiaryById(req, res, id) {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ status: 'error', message: 'No token provided' });
    }

    jwt.verify(token, JWT_SECRET);
    const diary = await Diary.findById(id);

    if (!diary) {
      return res.status(404).json({ status: 'error', message: 'Diary not found' });
    }

    res.status(200).json({ status: 'success', data: diary });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
}

async function createDiary(req, res) {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ status: 'error', message: 'No token provided' });
    }

    jwt.verify(token, JWT_SECRET);
    const { title, content, images, videos, mood, weather, date, category } = req.body;

    const diary = await Diary.create(title, content, images, videos, mood, weather, date, category);

    res.status(201).json({ status: 'success', message: 'Diary created successfully', data: diary });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
}

async function updateDiary(req, res, id) {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ status: 'error', message: 'No token provided' });
    }

    jwt.verify(token, JWT_SECRET);
    const { title, content, images, videos, mood, weather, date, category } = req.body;

    const existingDiary = await Diary.findById(id);
    if (!existingDiary) {
      return res.status(404).json({ status: 'error', message: 'Diary not found' });
    }

    const updatedDiary = await Diary.update(id, { title, content, images, videos, mood, weather, date, category });

    res.status(200).json({ status: 'success', message: 'Diary updated successfully', data: updatedDiary });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
}

async function deleteDiary(req, res, id) {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ status: 'error', message: 'No token provided' });
    }

    jwt.verify(token, JWT_SECRET);

    const existingDiary = await Diary.findById(id);
    if (!existingDiary) {
      return res.status(404).json({ status: 'error', message: 'Diary not found' });
    }

    await Diary.delete(id);

    res.status(200).json({ status: 'success', message: 'Diary deleted successfully' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
}
