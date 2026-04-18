const Video = require('../models/video');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export default function handler(req, res) {
  const { method } = req;

  switch (method) {
    case 'GET':
      if (req.url.includes('/')) {
        const id = req.url.split('/').pop();
        if (id && id !== 'videos') {
          return getVideoById(req, res, id);
        } else {
          return getVideos(req, res);
        }
      }
      break;
    case 'POST':
      return createVideo(req, res);
    case 'PUT':
      const id = req.url.split('/').pop();
      if (id && id !== 'videos') {
        return updateVideo(req, res, id);
      }
      break;
    case 'DELETE':
      const deleteId = req.url.split('/').pop();
      if (deleteId && deleteId !== 'videos') {
        return deleteVideo(req, res, deleteId);
      }
      break;
    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}

async function getVideos(req, res) {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ status: 'error', message: 'No token provided' });
    }

    jwt.verify(token, JWT_SECRET);
    
    const { page, limit, category, tags, startDate, endDate } = req.query;
    const videos = await Video.findAll(page, limit, category, tags, startDate, endDate);

    res.status(200).json({ status: 'success', data: videos });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
}

async function getVideoById(req, res, id) {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ status: 'error', message: 'No token provided' });
    }

    jwt.verify(token, JWT_SECRET);
    const video = await Video.findById(id);

    if (!video) {
      return res.status(404).json({ status: 'error', message: 'Video not found' });
    }

    res.status(200).json({ status: 'success', data: video });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
}

async function createVideo(req, res) {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ status: 'error', message: 'No token provided' });
    }

    jwt.verify(token, JWT_SECRET);
    const { title, description, tags, category, date, file } = req.body;

    if (!file) {
      return res.status(400).json({ status: 'error', message: 'Video file is required' });
    }

    const video = await Video.create(title, description, tags, category, date, file);

    res.status(201).json({ status: 'success', message: 'Video uploaded successfully', data: video });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
}

async function updateVideo(req, res, id) {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ status: 'error', message: 'No token provided' });
    }

    jwt.verify(token, JWT_SECRET);
    const { title, description, tags, category, date, file } = req.body;

    const existingVideo = await Video.findById(id);
    if (!existingVideo) {
      return res.status(404).json({ status: 'error', message: 'Video not found' });
    }

    const updatedVideo = await Video.update(id, { title, description, tags, category, date, file });

    res.status(200).json({ status: 'success', message: 'Video updated successfully', data: updatedVideo });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
}

async function deleteVideo(req, res, id) {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ status: 'error', message: 'No token provided' });
    }

    jwt.verify(token, JWT_SECRET);

    const existingVideo = await Video.findById(id);
    if (!existingVideo) {
      return res.status(404).json({ status: 'error', message: 'Video not found' });
    }

    await Video.delete(id);

    res.status(200).json({ status: 'success', message: 'Video deleted successfully' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
}