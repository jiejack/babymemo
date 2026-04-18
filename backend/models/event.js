const db = require('../database/connection');
const { v4: uuidv4 } = require('uuid');

class Event {
  static async create(title, description, date, type, color, reminder, repeat) {
    const id = uuidv4();
    const sql = 'INSERT INTO events (id, title, description, date, type, color, reminder, repeat) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    return new Promise((resolve, reject) => {
      db.run(sql, [id, title, description, date, type, color, reminder, repeat], function(err) {
        if (err) reject(err);
        else resolve({ id, title, description, date, type, color, reminder, repeat });
      });
    });
  }

  static async findById(id) {
    const sql = 'SELECT * FROM events WHERE id = ?';
    return new Promise((resolve, reject) => {
      db.get(sql, [id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  static async findAll(startDate = null, endDate = null, type = null) {
    let sql = 'SELECT * FROM events WHERE 1=1';
    const params = [];

    if (type) {
      sql += ' AND type = ?';
      params.push(type);
    }

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
    const sql = 'UPDATE events SET title = ?, description = ?, date = ?, type = ?, color = ?, reminder = ?, repeat = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
    return new Promise((resolve, reject) => {
      db.run(sql, [data.title, data.description, data.date, data.type, data.color, data.reminder, data.repeat, id], function(err) {
        if (err) reject(err);
        else resolve({ id, ...data });
      });
    });
  }

  static async delete(id) {
    const sql = 'DELETE FROM events WHERE id = ?';
    return new Promise((resolve, reject) => {
      db.run(sql, [id], function(err) {
        if (err) reject(err);
        else resolve({ id });
      });
    });
  }
}

module.exports = Event;
