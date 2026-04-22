import db from '../database/connection.js';
import { get, run, query } from '../database/utils.js';
import { v4 as uuidv4 } from 'uuid';

export async function createPhoto(photoData) {
  const { user_id, baby_id, url, title, description, tags, category, date, location } = photoData;
  const id = uuidv4();
  const sql = 'INSERT INTO photos (id, user_id, baby_id, url, title, description, tags, category, date, location) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
  await run(db, sql, [id, user_id, baby_id, url, title, description, tags, category, date, location]);
  return { id, user_id, baby_id, url, title, description, tags, category, date, location };
}

export async function getPhotoById(id) {
  const sql = 'SELECT * FROM photos WHERE id = ?';
  return await get(db, sql, [id]);
}

export async function getPhotos({ user_id, page = 1, limit = 10, category, start_date, end_date }) {
  let sql = 'SELECT * FROM photos WHERE user_id = ?';
  const params = [user_id];

  if (category) {
    sql += ' AND category = ?';
    params.push(category);
  }

  if (start_date) {
    sql += ' AND date >= ?';
    params.push(start_date);
  }

  if (end_date) {
    sql += ' AND date <= ?';
    params.push(end_date);
  }

  sql += ' ORDER BY date DESC LIMIT ? OFFSET ?';
  params.push(limit, (page - 1) * limit);

  return await query(db, sql, params);
}

export async function updatePhoto(id, photoData) {
  const { title, description, tags, category, date, location } = photoData;
  const sql = 'UPDATE photos SET title = ?, description = ?, tags = ?, category = ?, date = ?, location = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
  await run(db, sql, [title, description, tags, category, date, location, id]);
  return { id, ...photoData };
}

export async function deletePhoto(id) {
  const sql = 'DELETE FROM photos WHERE id = ?';
  await run(db, sql, [id]);
  return { id };
}
