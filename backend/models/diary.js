const db = require('../database/connection');
const { v4: uuidv4 } = require('uuid');

class Diary {
  static async create(title, content, images, videos, mood, weather, date, category) {
    const id = uuidv4();
    const sql = 'INSERT INTO diaries (id, title, content, images, videos, mood, weather, date, category) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
    return new Promise((resolve, reject) => {
      db.run(sql, [id, title, content, images, videos, mood, weather, date, category], function(err) {
        if (err) reject(err);
        else resolve({ id, title, content, images, videos, mood, weather, date, category });
      });
    });
  }

  static async findById(id) {
    const sql = 'SELECT * FROM diaries WHERE id = ?';
    return new Promise((resolve, reject) => {
      db.get(sql, [id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  static async findAll(page = 1, limit = 10, category = null, startDate = null, endDate = null) {
    let sql = 'SELECT * FROM diaries WHERE 1=1';
    const params = [];

    if (category) {
      sql += ' AND category = ?';
      params.push(category);
    }

    if (startDate) {
      sql += ' AND date >= ?';
      params.push(startDate);
    }

    if (endDate) {
      sql += ' AND date <= ?';
      params.push(endDate);
    }

    sql += ' ORDER BY date DESC LIMIT ? OFFSET ?';
    params.push(limit, (page - 1) * limit);

    return new Promise((resolve, reject) => {
      db.all(sql, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  static async update(id, data) {
    const sql = 'UPDATE diaries SET title = ?, content = ?, images = ?, videos = ?, mood = ?, weather = ?, date = ?, category = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
    return new Promise((resolve, reject) => {
      db.run(sql, [data.title, data.content, data.images, data.videos, data.mood, data.weather, data.date, data.category, id], function(err) {
        if (err) reject(err);
        else resolve({ id, ...data });
      });
    });
  }

  static async delete(id) {
    const sql = 'DELETE FROM diaries WHERE id = ?';
    return new Promise((resolve, reject) => {
      db.run(sql, [id], function(err) {
        if (err) reject(err);
        else resolve({ id });
      });
    });
  }
}

module.exports = Diary;
