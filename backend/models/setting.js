const db = require('../database/connection');

class Setting {
  static async get(key) {
    const sql = 'SELECT * FROM settings WHERE key = ?';
    return new Promise((resolve, reject) => {
      db.get(sql, [key], (err, row) => {
        if (err) reject(err);
        else resolve(row ? row.value : null);
      });
    });
  }

  static async getAll() {
    const sql = 'SELECT * FROM settings';
    return new Promise((resolve, reject) => {
      db.all(sql, (err, rows) => {
        if (err) reject(err);
        else {
          const settings = {};
          rows.forEach(row => {
            settings[row.key] = row.value;
          });
          resolve(settings);
        }
      });
    });
  }

  static async set(key, value) {
    const sql = 'INSERT OR REPLACE INTO settings (key, value, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP)';
    return new Promise((resolve, reject) => {
      db.run(sql, [key, value], function(err) {
        if (err) reject(err);
        else resolve({ key, value });
      });
    });
  }

  static async delete(key) {
    const sql = 'DELETE FROM settings WHERE key = ?';
    return new Promise((resolve, reject) => {
      db.run(sql, [key], function(err) {
        if (err) reject(err);
        else resolve({ key });
      });
    });
  }

  static async findAll() {
    const sql = 'SELECT * FROM settings';
    return new Promise((resolve, reject) => {
      db.all(sql, [], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }
}

module.exports = Setting;
