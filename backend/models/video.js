const db = require('../database/connection');
const { v4: uuidv4 } = require('uuid');

class Video {
  static async create(url, title, description, tags, category, date, duration, thumbnail) {
    const id = uuidv4();
    const sql = 'INSERT INTO videos (id, url, title, description, tags, category, date, duration, thumbnail) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
    return new Promise((resolve, reject) => {
      db.run(sql, [id, url, title, description, tags, category, date, duration, thumbnail], function(err) {
        if (err) reject(err);
        else resolve({ id, url, title, description, tags, category, date, duration, thumbnail });
      });
    });
  }

  static async findById(id) {
    const sql = 'SELECT * FROM videos WHERE id = ?';
    return new Promise((resolve, reject) => {
      db.get(sql, [id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  static async findAll(page = 1, limit = 10, category = null, tags = null, startDate = null, endDate = null) {
    let sql = 'SELECT * FROM videos WHERE 1=1';
    const params = [];

    if (category) {
      sql += ' AND category = ?';
      params.push(category);
    }

    if (tags) {
      sql += ' AND tags LIKE ?';
      params.push(`%${tags}%`);
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
    const sql = 'UPDATE videos SET title = ?, description = ?, tags = ?, category = ?, date = ?, duration = ?, thumbnail = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
    return new Promise((resolve, reject) => {
      db.run(sql, [data.title, data.description, data.tags, data.category, data.date, data.duration, data.thumbnail, id], function(err) {
        if (err) reject(err);
        else resolve({ id, ...data });
      });
    });
  }

  static async delete(id) {
    const sql = 'DELETE FROM videos WHERE id = ?';
    return new Promise((resolve, reject) => {
      db.run(sql, [id], function(err) {
        if (err) reject(err);
        else resolve({ id });
      });
    });
  }
}

module.exports = Video;
