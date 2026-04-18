const db = require('../database/connection');
const { v4: uuidv4 } = require('uuid');

class User {
  static async create(username, password, name, avatar) {
    const id = uuidv4();
    const sql = 'INSERT INTO users (id, username, password, name, avatar) VALUES (?, ?, ?, ?, ?)';
    return new Promise((resolve, reject) => {
      db.run(sql, [id, username, password, name, avatar], function(err) {
        if (err) reject(err);
        else resolve({ id, username, name, avatar });
      });
    });
  }

  static async findByUsername(username) {
    const sql = 'SELECT * FROM users WHERE username = ?';
    return new Promise((resolve, reject) => {
      db.get(sql, [username], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  static async findById(id) {
    const sql = 'SELECT * FROM users WHERE id = ?';
    return new Promise((resolve, reject) => {
      db.get(sql, [id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  static async update(id, data) {
    const sql = 'UPDATE users SET name = ?, avatar = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
    return new Promise((resolve, reject) => {
      db.run(sql, [data.name, data.avatar, id], function(err) {
        if (err) reject(err);
        else resolve({ id, ...data });
      });
    });
  }

  static async updatePassword(id, password) {
    const sql = 'UPDATE users SET password = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
    return new Promise((resolve, reject) => {
      db.run(sql, [password, id], function(err) {
        if (err) reject(err);
        else resolve({ id });
      });
    });
  }
}

module.exports = User;
