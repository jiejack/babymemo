const Baby = require('../models/baby');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export default function handler(req, res) {
  const { method } = req;

  switch (method) {
    case 'GET':
      if (req.url.includes('/')) {
        const id = req.url.split('/').pop();
        if (id && id !== 'babies') {
          return getBabyById(req, res, id);
        } else {
          return getBabies(req, res);
        }
      }
      break;
    case 'POST':
      return createBaby(req, res);
    case 'PUT':
      const id = req.url.split('/').pop();
      if (id && id !== 'babies') {
        return updateBaby(req, res, id);
      }
      break;
    case 'DELETE':
      const deleteId = req.url.split('/').pop();
      if (deleteId && deleteId !== 'babies') {
        return deleteBaby(req, res, deleteId);
      }
      break;
    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}

async function getBabies(req, res) {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ status: 'error', message: 'No token provided' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const babies = await Baby.findByUserId(decoded.id);

    res.status(200).json({ status: 'success', data: babies });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
}

async function getBabyById(req, res, id) {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ status: 'error', message: 'No token provided' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const baby = await Baby.findById(id);

    if (!baby) {
      return res.status(404).json({ status: 'error', message: 'Baby not found' });
    }

    // 验证宝宝是否属于当前用户
    if (baby.user_id !== decoded.id) {
      return res.status(403).json({ status: 'error', message: 'Access denied' });
    }

    res.status(200).json({ status: 'success', data: baby });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
}

async function createBaby(req, res) {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ status: 'error', message: 'No token provided' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const { name, birthday, gender, avatar } = req.body;

    const baby = await Baby.create(decoded.id, name, birthday, gender, avatar);

    res.status(201).json({ status: 'success', message: 'Baby created successfully', data: baby });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
}

async function updateBaby(req, res, id) {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ status: 'error', message: 'No token provided' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const { name, birthday, gender, avatar } = req.body;

    // 验证宝宝是否属于当前用户
    const existingBaby = await Baby.findById(id);
    if (!existingBaby) {
      return res.status(404).json({ status: 'error', message: 'Baby not found' });
    }

    if (existingBaby.user_id !== decoded.id) {
      return res.status(403).json({ status: 'error', message: 'Access denied' });
    }

    const updatedBaby = await Baby.update(id, { name, birthday, gender, avatar });

    res.status(200).json({ status: 'success', message: 'Baby updated successfully', data: updatedBaby });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
}

async function deleteBaby(req, res, id) {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ status: 'error', message: 'No token provided' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    // 验证宝宝是否属于当前用户
    const existingBaby = await Baby.findById(id);
    if (!existingBaby) {
      return res.status(404).json({ status: 'error', message: 'Baby not found' });
    }

    if (existingBaby.user_id !== decoded.id) {
      return res.status(403).json({ status: 'error', message: 'Access denied' });
    }

    await Baby.delete(id);

    res.status(200).json({ status: 'success', message: 'Baby deleted successfully' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
}
