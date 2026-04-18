const Event = require('../models/event');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export default function handler(req, res) {
  const { method } = req;

  switch (method) {
    case 'GET':
      if (req.url.includes('/')) {
        const id = req.url.split('/').pop();
        if (id && id !== 'events') {
          return getEventById(req, res, id);
        } else {
          return getEvents(req, res);
        }
      }
      break;
    case 'POST':
      return createEvent(req, res);
    case 'PUT':
      const id = req.url.split('/').pop();
      if (id && id !== 'events') {
        return updateEvent(req, res, id);
      }
      break;
    case 'DELETE':
      const deleteId = req.url.split('/').pop();
      if (deleteId && deleteId !== 'events') {
        return deleteEvent(req, res, deleteId);
      }
      break;
    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}

async function getEvents(req, res) {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ status: 'error', message: 'No token provided' });
    }

    jwt.verify(token, JWT_SECRET);
    
    const { startDate, endDate, type } = req.query;
    const events = await Event.findAll(startDate, endDate, type);

    res.status(200).json({ status: 'success', data: events });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
}

async function getEventById(req, res, id) {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ status: 'error', message: 'No token provided' });
    }

    jwt.verify(token, JWT_SECRET);
    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({ status: 'error', message: 'Event not found' });
    }

    res.status(200).json({ status: 'success', data: event });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
}

async function createEvent(req, res) {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ status: 'error', message: 'No token provided' });
    }

    jwt.verify(token, JWT_SECRET);
    const { title, description, date, type, color, reminder, repeat } = req.body;

    const event = await Event.create(title, description, date, type, color, reminder, repeat);

    res.status(201).json({ status: 'success', message: 'Event created successfully', data: event });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
}

async function updateEvent(req, res, id) {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ status: 'error', message: 'No token provided' });
    }

    jwt.verify(token, JWT_SECRET);
    const { title, description, date, type, color, reminder, repeat } = req.body;

    const existingEvent = await Event.findById(id);
    if (!existingEvent) {
      return res.status(404).json({ status: 'error', message: 'Event not found' });
    }

    const updatedEvent = await Event.update(id, { title, description, date, type, color, reminder, repeat });

    res.status(200).json({ status: 'success', message: 'Event updated successfully', data: updatedEvent });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
}

async function deleteEvent(req, res, id) {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ status: 'error', message: 'No token provided' });
    }

    jwt.verify(token, JWT_SECRET);

    const existingEvent = await Event.findById(id);
    if (!existingEvent) {
      return res.status(404).json({ status: 'error', message: 'Event not found' });
    }

    await Event.delete(id);

    res.status(200).json({ status: 'success', message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
}
