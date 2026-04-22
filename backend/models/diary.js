import db from '../database/connection.js';
import { get, run, query } from '../database/utils.js';
import { v4 as uuidv4 } from 'uuid';

export async function createDiary(diaryData) {
  const { user_id, baby_id, title, content, images, videos, mood, weather, date, category } = diaryData;
  const id = uuidv4();
  const sql = 'INSERT INTO diaries (id, user_id, baby_id, title, content, images, videos, mood, weather, date, category) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
  await run(db, sql, [id, user_id, baby_id, title, content, images, videos, mood, weather, date, category]);
  return { id, user_id, baby_id, title, content, images, videos, mood, weather, date, category };
}

export async function getDiaryById(id) {
  const sql = 'SELECT * FROM diaries WHERE id = ?';
  return await get(db, sql, [id]);
}

export async function getDiaries({ user_id, category, start_date, end_date }) {
  let sql = 'SELECT * FROM diaries WHERE user_id = ?';
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

  sql += ' ORDER BY date DESC';

  return await query(db, sql, params);
}

export async function updateDiary(id, diaryData) {
  const { title, content, images, videos, mood, weather, date, category } = diaryData;
  const sql = 'UPDATE diaries SET title = ?, content = ?, images = ?, videos = ?, mood = ?, weather = ?, date = ?, category = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
  await run(db, sql, [title, content, images, videos, mood, weather, date, category, id]);
  return { id, ...diaryData };
}

export async function deleteDiary(id) {
  const sql = 'DELETE FROM diaries WHERE id = ?';
  await run(db, sql, [id]);
  return { id };
}
