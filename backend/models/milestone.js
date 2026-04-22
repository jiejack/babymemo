import db from '../database/connection.js';
import { get, run, query } from '../database/utils.js';
import { v4 as uuidv4 } from 'uuid';

export async function createMilestone(milestoneData) {
  const { user_id, baby_id, title, description, date, type, images, tags } = milestoneData;
  const id = uuidv4();
  const sql = 'INSERT INTO milestones (id, user_id, baby_id, title, description, date, type, images, tags) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
  await run(db, sql, [id, user_id, baby_id, title, description, date, type, images, tags]);
  return { id, user_id, baby_id, title, description, date, type, images, tags };
}

export async function getMilestoneById(id) {
  const sql = 'SELECT * FROM milestones WHERE id = ?';
  return await get(db, sql, [id]);
}

export async function getMilestones({ user_id, type, start_date, end_date }) {
  let sql = 'SELECT * FROM milestones WHERE user_id = ?';
  const params = [user_id];

  if (type) {
    sql += ' AND type = ?';
    params.push(type);
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

export async function updateMilestone(id, milestoneData) {
  const { title, description, date, type, images, tags } = milestoneData;
  const sql = 'UPDATE milestones SET title = ?, description = ?, date = ?, type = ?, images = ?, tags = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
  await run(db, sql, [title, description, date, type, images, tags, id]);
  return { id, ...milestoneData };
}

export async function deleteMilestone(id) {
  const sql = 'DELETE FROM milestones WHERE id = ?';
  await run(db, sql, [id]);
  return { id };
}
