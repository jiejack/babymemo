const db = require('../database/connection');
const { v4: uuidv4 } = require('uuid');

class Growth {
  static async create(baby_id, height, weight, head_circumference, date, notes) {
    const id = uuidv4();
    const sql = 'INSERT INTO growth_indicators (id, baby_id, height, weight, head_circumference, date, notes) VALUES (?, ?, ?, ?, ?, ?, ?)';
    return new Promise((resolve, reject) => {
      db.run(sql, [id, baby_id, height, weight, head_circumference, date, notes], function(err) {
        if (err) reject(err);
        else resolve({ id, baby_id, height, weight, head_circumference, date, notes });
      });
    });
  }

  static async findById(id) {
    const sql = 'SELECT * FROM growth_indicators WHERE id = ?';
    return new Promise((resolve, reject) => {
      db.get(sql, [id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  static async findByBabyId(baby_id, startDate = null, endDate = null) {
    let sql = 'SELECT * FROM growth_indicators WHERE baby_id = ?';
    const params = [baby_id];

    if (startDate) {
      sql += ' AND date >= ?';
      params.push(startDate);
    }

    if (endDate) {
      sql += ' AND date <= ?';
      params.push(endDate);
    }

    sql += ' ORDER BY date ASC';

    return new Promise((resolve, reject) => {
      db.all(sql, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  static async update(id, data) {
    const sql = 'UPDATE growth_indicators SET height = ?, weight = ?, head_circumference = ?, date = ?, notes = ? WHERE id = ?';
    return new Promise((resolve, reject) => {
      db.run(sql, [data.height, data.weight, data.head_circumference, data.date, data.notes, id], function(err) {
        if (err) reject(err);
        else resolve({ id, ...data });
      });
    });
  }

  static async delete(id) {
    const sql = 'DELETE FROM growth_indicators WHERE id = ?';
    return new Promise((resolve, reject) => {
      db.run(sql, [id], function(err) {
        if (err) reject(err);
        else resolve({ id });
      });
    });
  }

  static async findAll() {
    const sql = 'SELECT * FROM growth_indicators';
    return new Promise((resolve, reject) => {
      db.all(sql, [], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }
}

module.exports = Growth;
