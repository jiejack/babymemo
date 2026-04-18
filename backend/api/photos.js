const Photo = require('../models/photo');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export default function handler(req, res) {
  const { method } = req;

  switch (method) {
    case 'GET':
      if (req.url.includes('/')) {
        const id = req.url.split('/').pop();
        if (id && id !== 'photos') {
          return getPhotoById(req, res, id);
        } else {
          return getPhotos(req, res);
        }
      }
      break;
    case 'POST':
      return createPhoto(req, res);
    case 'PUT':
      const id = req.url.split('/').pop();
      if (id && id !== 'photos') {
        return updatePhoto(req, res, id);
      }
      break;
    case 'DELETE':
      const deleteId = req.url.split('/').pop();
      if (deleteId && deleteId !== 'photos') {
        return deletePhoto(req, res, deleteId);
      }
      break;
    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}

async function getPhotos(req, res) {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ status: 'error', message: 'No token provided' });
    }

    jwt.verify(token, JWT_SECRET);
    
    const { page = 1, limit = 10, category, tags, startDate, endDate } = req.query;
    const photos = await Photo.findAll(
      parseInt(page),
      parseInt(limit),
      category,
      tags,
      startDate,
      endDate
    );

    res.status(200).json({ status: 'success', data: photos });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
}

async function getPhotoById(req, res, id) {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ status: 'error', message: 'No token provided' });
    }

    jwt.verify(token, JWT_SECRET);
    const photo = await Photo.findById(id);

    if (!photo) {
      return res.status(404).json({ status: 'error', message: 'Photo not found' });
    }

    res.status(200).json({ status: 'success', data: photo });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
}

async function createPhoto(req, res) {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ status: 'error', message: 'No token provided' });
    }

    jwt.verify(token, JWT_SECRET);
    const { url, title, description, tags, category, date, location } = req.body;

    const photo = await Photo.create(url, title, description, tags, category, date, location);

    res.status(201).json({ status: 'success', message: 'Photo created successfully', data: photo });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
}

async function updatePhoto(req, res, id) {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ status: 'error', message: 'No token provided' });
    }

    jwt.verify(token, JWT_SECRET);
    const { title, description, tags, category, date, location } = req.body;

    const existingPhoto = await Photo.findById(id);
    if (!existingPhoto) {
      return res.status(404).json({ status: 'error', message: 'Photo not found' });
    }

    const updatedPhoto = await Photo.update(id, { title, description, tags, category, date, location });

    res.status(200).json({ status: 'success', message: 'Photo updated successfully', data: updatedPhoto });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
}

async function deletePhoto(req, res, id) {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ status: 'error', message: 'No token provided' });
    }

    jwt.verify(token, JWT_SECRET);

    const existingPhoto = await Photo.findById(id);
    if (!existingPhoto) {
      return res.status(404).json({ status: 'error', message: 'Photo not found' });
    }

    await Photo.delete(id);

    res.status(200).json({ status: 'success', message: 'Photo deleted successfully' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
}
