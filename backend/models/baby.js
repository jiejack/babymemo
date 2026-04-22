import db from '../database/connection.js';
import { get, run, query } from '../database/utils.js';
import { v4 as uuidv4 } from 'uuid';

class Baby {
  static async create(user_id, name, birthday, gender, avatar) {
    const id = uuidv4();
    const sql = 'INSERT INTO babies (id, user_id, name, birthday, gender, avatar) VALUES (?, ?, ?, ?, ?, ?)';
    await run(db, sql, [id, user_id, name, birthday, gender, avatar]);
    return { id, user_id, name, birthday, gender, avatar };
  }

  static async findById(id) {
    const sql = 'SELECT * FROM babies WHERE id = ?';
    return await get(db, sql, [id]);
  }

  static async findAll(user_id) {
    const sql = user_id ? 'SELECT * FROM babies WHERE user_id = ?' : 'SELECT * FROM babies';
    return await query(db, sql, user_id ? [user_id] : []);
  }

  static async update(id, data) {
    const sql = 'UPDATE babies SET name = ?, birthday = ?, gender = ?, avatar = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
    await run(db, sql, [data.name, data.birthday, data.gender, data.avatar, id]);
    return { id, ...data };
  }

  static async delete(id) {
    const sql = 'DELETE FROM babies WHERE id = ?';
    await run(db, sql, [id]);
    return { id };
  }
}

// 函数方式导出，兼容API路由文件的导入方式
export async function createBaby(babyData) {
  const { user_id, name, birthday, gender, avatar } = babyData;
  return await Baby.create(user_id, name, birthday, gender, avatar);
}

export async function getBabyById(id) {
  return await Baby.findById(id);
}

export async function getBabiesByUserId(user_id) {
  return await Baby.findAll(user_id);
}

export async function updateBaby(id, babyData) {
  return await Baby.update(id, babyData);
}

export async function deleteBaby(id) {
  return await Baby.delete(id);
}

export default Baby;