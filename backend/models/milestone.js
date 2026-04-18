const db = require('../database/connection');
const { v4: uuidv4 } = require('uuid');

class Milestone {
  static async create(title, description, date, type, images, tags) {
    const id = uuidv4();
    const sql = 'INSERT INTO milestones (id, title, description, date, type, images, tags) VALUES (?, ?, ?, ?, ?, ?, ?)';
    return new Promise((resolve, reject) => {
      db.run(sql, [id, title, description, date, type, images, tags], function(err) {
        if (err) reject(err);
        else resolve({ id, title, description, date, type, images, tags });
      });
    });
  }

  static async findById(id) {
    const sql = 'SELECT * FROM milestones WHERE id = ?';
    return new Promise((resolve, reject) => {
      db.get(sql, [id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  static async findAll(page = 1, limit = 10, type = null, startDate = null, endDate = null) {
    let sql = 'SELECT * FROM milestones WHERE 1=1';
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
    const sql = 'UPDATE milestones SET title = ?, description = ?, date = ?, type = ?, images = ?, tags = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
    return new Promise((resolve, reject) => {
      db.run(sql, [data.title, data.description, data.date, data.type, data.images, data.tags, id], function(err) {
        if (err) reject(err);
        else resolve({ id, ...data });
      });
    });
  }

  static async delete(id) {
    const sql = 'DELETE FROM milestones WHERE id = ?';
    return new Promise((resolve, reject) => {
      db.run(sql, [id], function(err) {
        if (err) reject(err);
        else resolve({ id });
      });
    });
  }
}

module.exports = Milestone;
