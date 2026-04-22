import db from '../database/connection.js';
import { get, run, query } from '../database/utils.js';
import { v4 as uuidv4 } from 'uuid';

export async function createEvent(eventData) {
  const { user_id, baby_id, title, description, date, type, color, reminder, repeat } = eventData;
  const id = uuidv4();
  const sql = 'INSERT INTO events (id, user_id, baby_id, title, description, date, type, color, reminder, repeat) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
  await run(db, sql, [id, user_id, baby_id, title, description, date, type, color, reminder || 0, repeat]);
  return { id, user_id, baby_id, title, description, date, type, color, reminder, repeat };
}

export async function getEventById(id) {
  const sql = 'SELECT * FROM events WHERE id = ?';
  return await get(db, sql, [id]);
}

export async function getEvents({ user_id, start_date, end_date }) {
  let sql = 'SELECT * FROM events WHERE user_id = ?';
  const params = [user_id];

  if (start_date) {
    sql += ' AND date >= ?';
    params.push(start_date);
  }

  if (end_date) {
    sql += ' AND date <= ?';
    params.push(end_date);
  }

  sql += ' ORDER BY date ASC';

  return await query(db, sql, params);
}

export async function updateEvent(id, eventData) {
  const { title, description, date, type, color, reminder, repeat } = eventData;
  const sql = 'UPDATE events SET title = ?, description = ?, date = ?, type = ?, color = ?, reminder = ?, repeat = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
  await run(db, sql, [title, description, date, type, color, reminder || 0, repeat, id]);
  return { id, ...eventData };
}

export async function deleteEvent(id) {
  const sql = 'DELETE FROM events WHERE id = ?';
  await run(db, sql, [id]);
  return { id };
}