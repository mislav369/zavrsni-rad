const db = require("../database.js");

const getActivityDates = (userId) => {
  const sql = `SELECT activity_date FROM user_activity WHERE user_id = ? ORDER BY activity_date DESC`;
  return new Promise((resolve, reject) => {
    db.all(sql, [userId], (err, rows) => (err ? reject(err) : resolve(rows)));
  });
};

const logUserActivity = (userId) => {
  return new Promise((resolve, reject) => {
    const sql = `INSERT OR IGNORE INTO user_activity (user_id, activity_date) VALUES (?, DATE('now'))`;
    db.run(sql, [userId], (err) => {
      if (err) {
        console.error("Greška pri zapisivanju aktivnosti korisnika:", err);
        return reject(err);
      }
      resolve();
    });
  });
};

module.exports = {
  getActivityDates,
  logUserActivity,
};
