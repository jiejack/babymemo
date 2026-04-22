import db from '../database/connection.js';
import { get, run, query } from '../database/utils.js';
import { v4 as uuidv4 } from 'uuid';

class Growth {
  static async create(baby_id, height, weight, head_circumference, date, notes) {
    const id = uuidv4();
    const sql = 'INSERT INTO growth_indicators (id, baby_id, height, weight, head_circumference, date, notes) VALUES (?, ?, ?, ?, ?, ?, ?)';
    await run(db, sql, [id, baby_id, height, weight, head_circumference, date, notes]);
    return { id, baby_id, height, weight, head_circumference, date, notes };
  }

  static async findById(id) {
    const sql = 'SELECT * FROM growth_indicators WHERE id = ?';
    return await get(db, sql, [id]);
  }

  static async findAll(baby_id, startDate, endDate) {
    let sql = 'SELECT * FROM growth_indicators WHERE 1=1';
    const params = [];

    if (baby_id) {
      sql += ' AND baby_id = ?';
      params.push(baby_id);
    }

    if (startDate) {
      sql += ' AND date >= ?';
      params.push(startDate);
    }

    if (endDate) {
      sql += ' AND date <= ?';
      params.push(endDate);
    }

    sql += ' ORDER BY date DESC';

    return await query(db, sql, params);
  }

  static async update(id, data) {
    const sql = 'UPDATE growth_indicators SET height = ?, weight = ?, head_circumference = ?, date = ?, notes = ? WHERE id = ?';
    await run(db, sql, [data.height, data.weight, data.head_circumference, data.date, data.notes, id]);
    return { id, ...data };
  }

  static async delete(id) {
    const sql = 'DELETE FROM growth_indicators WHERE id = ?';
    await run(db, sql, [id]);
    return { id };
  }
}

export default Growth;