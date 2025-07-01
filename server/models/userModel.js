const db = require("../database.js");

const findByEmail = (email) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM users WHERE email = ?`;
    db.get(sql, [email], (err, user) => {
      if (err) {
        reject(err);
      } else {
        resolve(user);
      }
    });
  });
};

const getTotalUserCount = () => {
  return new Promise((resolve, reject) => {
    db.get("SELECT COUNT(*) as count FROM users", (err, row) => {
      if (err) return reject(err);
      resolve(row.count);
    });
  });
};

const create = (userData) => {
  return new Promise((resolve, reject) => {
    const { first_name, last_name, email, hashedPassword, is_admin } = userData;
    const sql = `INSERT INTO users (first_name, last_name, email, password, is_admin) VALUES (?, ?, ?, ?, ?)`;
    const params = [first_name, last_name, email, hashedPassword, is_admin];

    db.run(sql, params, function (err) {
      if (err) {
        return reject(err);
      }

      db.get("SELECT * FROM users WHERE id = ?", [this.lastID], (err, user) => {
        if (err) return reject(err);
        resolve(user);
      });
    });
  });
};

const getAll = () => {
  const sql = "SELECT id, first_name, last_name, email, is_admin FROM users";
  return new Promise((resolve, reject) => {
    db.all(sql, [], (err, rows) => (err ? reject(err) : resolve(rows)));
  });
};

const remove = (id) => {
  return new Promise((resolve, reject) => {
    const sql = "DELETE FROM users WHERE id = ?";
    db.run(sql, [id], function (err) {
      if (err) return reject(err);
      resolve(this.changes);
    });
  });
};

module.exports = {
  findByEmail,
  getTotalUserCount,
  create,
  getAll,
  remove,
};
