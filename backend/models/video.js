import db from '../database/connection.js';
import { get, run, query } from '../database/utils.js';
import { v4 as uuidv4 } from 'uuid';

export async function createVideo(videoData) {
  const { user_id, baby_id, url, title, description, tags, category, date, duration, thumbnail } = videoData;
  const id = uuidv4();
  const sql = 'INSERT INTO videos (id, user_id, baby_id, url, title, description, tags, category, date, duration, thumbnail) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
  await run(db, sql, [id, user_id, baby_id, url, title, description, tags, category, date, duration, thumbnail]);
  return { id, user_id, baby_id, url, title, description, tags, category, date, duration, thumbnail };
}

export async function getVideoById(id) {
  const sql = 'SELECT * FROM videos WHERE id = ?';
  return await get(db, sql, [id]);
}

export async function getVideos({ user_id, page = 1, limit = 10, category, start_date, end_date }) {
  let sql = 'SELECT * FROM videos WHERE user_id = ?';
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

export async function updateVideo(id, videoData) {
  const { title, description, tags, category, date, duration, thumbnail } = videoData;
  const sql = 'UPDATE videos SET title = ?, description = ?, tags = ?, category = ?, date = ?, duration = ?, thumbnail = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
  await run(db, sql, [title, description, tags, category, date, duration, thumbnail, id]);
  return { id, ...videoData };
}

export async function deleteVideo(id) {
  const sql = 'DELETE FROM videos WHERE id = ?';
  await run(db, sql, [id]);
  return { id };
}