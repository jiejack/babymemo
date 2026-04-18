const db = require('../database/connection');
const { v4: uuidv4 } = require('uuid');

class Baby {
  static async create(user_id, name, birthday, gender, avatar) {
    const id = uuidv4();
    const sql = 'INSERT INTO babies (id, user_id, name, birthday, gender, avatar) VALUES (?, ?, ?, ?, ?, ?)';
    return new Promise((resolve, reject) => {
      db.run(sql, [id, user_id, name, birthday, gender, avatar], function(err) {
        if (err) reject(err);
        else resolve({ id, user_id, name, birthday, gender, avatar });
      });
    });
  }

  static async findById(id) {
    const sql = 'SELECT * FROM babies WHERE id = ?';
    return new Promise((resolve, reject) => {
      db.get(sql, [id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  static async findByUserId(user_id) {
    const sql = 'SELECT * FROM babies WHERE user_id = ?';
    return new Promise((resolve, reject) => {
      db.all(sql, [user_id], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  static async update(id, data) {
    const sql = 'UPDATE babies SET name = ?, birthday = ?, gender = ?, avatar = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
    return new Promise((resolve, reject) => {
      db.run(sql, [data.name, data.birthday, data.gender, data.avatar, id], function(err) {
        if (err) reject(err);
        else resolve({ id, ...data });
      });
    });
  }

  static async delete(id) {
    const sql = 'DELETE FROM babies WHERE id = ?';
    return new Promise((resolve, reject) => {
      db.run(sql, [id], function(err) {
        if (err) reject(err);
        else resolve({ id });
      });
    });
  }
}

module.exports = Baby;
