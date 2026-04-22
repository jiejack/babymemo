import { query, get, run } from '../database/utils.js';

export async function get(key) {
  const sql = 'SELECT * FROM settings WHERE key = ?';
  const row = await get(sql, [key]);
  return row ? row.value : null;
}

export async function getAll() {
  const sql = 'SELECT * FROM settings';
  const rows = await query(sql);
  const settings = {};
  rows.forEach(row => {
    settings[row.key] = row.value;
  });
  return settings;
}

export async function set(key, value) {
  const sql = 'INSERT OR REPLACE INTO settings (key, value, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP)';
  await run(sql, [key, value]);
  return { key, value };
}

export async function del(key) {
  const sql = 'DELETE FROM settings WHERE key = ?';
  await run(sql, [key]);
  return { key };
}

export async function findAll() {
  const sql = 'SELECT * FROM settings';
  return await query(sql);
}

export async function findByKey(key) {
  const sql = 'SELECT * FROM settings WHERE key = ?';
  return await get(sql, [key]);
}

export async function upsert(key, value) {
  const sql = 'INSERT OR REPLACE INTO settings (key, value, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP)';
  await run(sql, [key, value]);
  return { key, value };
}
