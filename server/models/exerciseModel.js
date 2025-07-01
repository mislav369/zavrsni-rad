const db = require("../database.js");

const findByLessonId = (lessonId) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM exercises WHERE lesson_id = ?";

    db.get(sql, [lessonId], (err, exercise) => {
      if (err) {
        console.error(
          `Greška pri dohvaćanju vježbe za lekciju ${lessonId}:`,
          err.message
        );
        return reject(err);
      }
      resolve(exercise);
    });
  });
};

const findById = (id) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM exercises WHERE id = ?";
    db.get(sql, [id], (err, exercise) => {
      if (err) return reject(err);
      resolve(exercise);
    });
  });
};

const create = ({
  lesson_id,
  title,
  description,
  template_code,
  expected_output,
}) => {
  const sql = `INSERT INTO exercises (lesson_id, title, description, template_code, expected_output) VALUES (?, ?, ?, ?, ?)`;
  return new Promise((resolve, reject) => {
    db.run(
      sql,
      [lesson_id, title, description, template_code, expected_output],
      function (err) {
        if (err) return reject(err);
        resolve(this.lastID);
      }
    );
  });
};

const update = (id, { title, description, template_code, expected_output }) => {
  const sql = `UPDATE exercises SET title = ?, description = ?, template_code = ?, expected_output = ? WHERE id = ?`;
  return new Promise((resolve, reject) => {
    db.run(
      sql,
      [title, description, template_code, expected_output, id],
      (err) => {
        if (err) return reject(err);
        resolve();
      }
    );
  });
};

const remove = (id) => {
  return new Promise((resolve, reject) => {
    const sql = "DELETE FROM exercises WHERE id = ?";
    db.run(sql, [id], function (err) {
      if (err) return reject(err);
      resolve(this.changes);
    });
  });
};

module.exports = {
  findByLessonId,
  findById,
  create,
  update,
  remove,
};
