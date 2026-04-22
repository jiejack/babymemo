// 数据库操作的Promise封装工具

/**
 * 执行SQL查询并返回结果
 * @param {sqlite3.Database} db - 数据库连接
 * @param {string} sql - SQL语句
 * @param {Array} params - SQL参数
 * @returns {Promise<Array>} 查询结果
 */
export function query(db, sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

/**
 * 执行SQL查询并返回单行结果
 * @param {sqlite3.Database} db - 数据库连接
 * @param {string} sql - SQL语句
 * @param {Array} params - SQL参数
 * @returns {Promise<Object|null>} 查询结果
 */
export function get(db, sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
}

/**
 * 执行SQL语句（如INSERT、UPDATE、DELETE）
 * @param {sqlite3.Database} db - 数据库连接
 * @param {string} sql - SQL语句
 * @param {Array} params - SQL参数
 * @returns {Promise<{lastID: number, changes: number}>} 执行结果
 */
export function run(db, sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) {
        reject(err);
      } else {
        resolve({ lastID: this.lastID, changes: this.changes });
      }
    });
  });
}