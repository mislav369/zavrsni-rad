const db = require("../database.js");

const getAll = () => {
  return new Promise((resolve, reject) => {
    const sql =
      "SELECT id, title, order_num FROM lessons ORDER BY order_num ASC";
    db.all(sql, [], (err, rows) => {
      if (err) {
        console.error("Greška pri dohvaćanju lekcija:", err.message);
        return reject(err);
      }
      resolve(rows);
    });
  });
};

const findById = (id) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT id, title, order_num, content FROM lessons WHERE id = ?`;
    db.get(sql, [id], (err, row) => {
      if (err) {
        console.error(
          `Greška pri dohvaćanju lekcije s ID-em ${id}:`,
          err.message
        );
        return reject(err);
      }
      resolve(row);
    });
  });
};

const getTotalCount = () => {
  return new Promise((resolve, reject) => {
    db.get("SELECT COUNT(*) as count FROM lessons", [], (err, row) =>
      err ? reject(err) : resolve(row.count)
    );
  });
};

const findNextForUser = (userId) => {
  const sql = `
    SELECT id, title, order_num FROM lessons
    WHERE id NOT IN (SELECT lesson_id FROM user_lesson_progress WHERE user_id = ? AND is_complete = 1)
    ORDER BY order_num ASC LIMIT 1
  `;
  return new Promise((resolve, reject) => {
    db.get(sql, [userId], (err, row) =>
      err ? reject(err) : resolve(row || null)
    );
  });
};

const findLastCompletedForUser = (userId) => {
  const sql = `
    SELECT l.id, l.title, l.order_num
    FROM lessons l
    JOIN user_lesson_progress ulp ON l.id = ulp.lesson_id
    WHERE ulp.user_id = ? AND ulp.is_complete = 1
    ORDER BY ulp.completed_at DESC LIMIT 1
  `;
  return new Promise((resolve, reject) => {
    db.get(sql, [userId], (err, row) =>
      err ? reject(err) : resolve(row || null)
    );
  });
};

const findNextByCurrentLessonId = (currentLessonId) => {
  const sql = `
    SELECT id, title, order_num FROM lessons
    WHERE order_num > (SELECT order_num FROM lessons WHERE id = ?)
    ORDER BY order_num ASC LIMIT 1
  `;
  return new Promise((resolve, reject) => {
    db.get(sql, [currentLessonId], (err, row) =>
      err ? reject(err) : resolve(row || null)
    );
  });
};

const getAllForAdmin = () => {
  const sql = "SELECT * FROM lessons ORDER BY order_num ASC";
  return new Promise((resolve, reject) => {
    db.all(sql, [], (err, rows) => (err ? reject(err) : resolve(rows)));
  });
};

const create = ({ title, content, order_num }) => {
  const sql = `INSERT INTO lessons (title, content, order_num) VALUES (?, ?, ?)`;
  return new Promise((resolve, reject) => {
    db.run(sql, [title, content, order_num], function (err) {
      if (err) return reject(err);
      resolve(this.lastID);
    });
  });
};

const update = (id, { title, content, order_num }) => {
  const sql = `UPDATE lessons SET title = ?, content = ?, order_num = ? WHERE id = ?`;
  return new Promise((resolve, reject) => {
    db.run(sql, [title, content, order_num, id], (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
};

const remove = (id) => {
  const sql = "DELETE FROM lessons WHERE id = ?";
  return new Promise((resolve, reject) => {
    db.run(sql, [id], function (err) {
      if (err) return reject(err);
      resolve(this.changes);
    });
  });
};

module.exports = {
  getAll,
  getTotalCount,
  findNextForUser,
  findLastCompletedForUser,
  findById,
  getAllForAdmin,
  create,
  update,
  remove,
  findNextByCurrentLessonId,
};
