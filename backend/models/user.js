import { get, run, query } from '../database/utils.mjs';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';

export async function createUser(userData) {
  const { username, password, name, avatar } = userData;
  const id = uuidv4();
  const hashedPassword = await bcrypt.hash(password, 10);
  const sql = 'INSERT INTO users (id, username, password, name, avatar) VALUES (?, ?, ?, ?, ?)';
  await run(sql, [id, username, hashedPassword, name, avatar]);
  return { id, username, name, avatar };
}

export async function getUserByUsername(username) {
  const sql = 'SELECT * FROM users WHERE username = ?';
  return await get(sql, [username]);
}

export async function getUserById(id) {
  const sql = 'SELECT * FROM users WHERE id = ?';
  return await get(sql, [id]);
}

export async function updateUser(id, userData) {
  const { name, avatar } = userData;
  const sql = 'UPDATE users SET name = ?, avatar = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
  await run(sql, [name, avatar, id]);
  return { id, ...userData };
}

export async function updateUserPassword(id, password) {
  const hashedPassword = await bcrypt.hash(password, 10);
  const sql = 'UPDATE users SET password = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
  await run(sql, [hashedPassword, id]);
  return { id };
}

export async function getAllUsers() {
  const sql = 'SELECT * FROM users';
  return await query(sql, []);
}
