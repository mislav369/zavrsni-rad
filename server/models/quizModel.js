const db = require("../database.js");

const findByLessonId = async (lessonId) => {
  const quiz = await new Promise((resolve, reject) => {
    db.get(
      "SELECT * FROM quizzes WHERE lesson_id = ?",
      [lessonId],
      (err, row) => (err ? reject(err) : resolve(row))
    );
  });

  if (!quiz) {
    return null;
  }

  const questions = await new Promise((resolve, reject) => {
    db.all(
      "SELECT id, question_text, options, correct_option_index FROM quiz_questions WHERE quiz_id = ?",
      [quiz.id],
      (err, rows) => (err ? reject(err) : resolve(rows))
    );
  });

  quiz.questions = questions;
  return quiz;
};

const getCorrectAnswers = (questionIds) => {
  const sql = `SELECT id, correct_option_index FROM quiz_questions WHERE id IN (${questionIds
    .map(() => "?")
    .join(",")})`;
  return new Promise((resolve, reject) => {
    db.all(sql, questionIds, (err, rows) =>
      err ? reject(err) : resolve(rows)
    );
  });
};

const getLessonIdForQuiz = (quizId) => {
  const sql = `SELECT lesson_id FROM quizzes WHERE id = ?`;
  return new Promise((resolve, reject) => {
    db.get(sql, [quizId], (err, row) => (err ? reject(err) : resolve(row)));
  });
};

const findByLessonIdForAdmin = async (lessonId) => {
  const quiz = await new Promise((res, rej) =>
    db.get("SELECT * FROM quizzes WHERE lesson_id = ?", [lessonId], (e, r) =>
      e ? rej(e) : res(r)
    )
  );
  if (!quiz) return null;

  const questions = await new Promise((res, rej) =>
    db.all(
      "SELECT * FROM quiz_questions WHERE quiz_id = ?",
      [quiz.id],
      (e, r) => (e ? rej(e) : res(r))
    )
  );

  quiz.questions = questions;
  return quiz;
};

const _insertQuestions = (quizId, questions) => {
  return new Promise((resolve, reject) => {
    if (!questions || questions.length === 0) {
      return resolve();
    }
    const stmt = db.prepare(
      "INSERT INTO quiz_questions (quiz_id, question_text, options, correct_option_index) VALUES (?, ?, ?, ?)"
    );
    for (const q of questions) {
      stmt.run(
        quizId,
        q.question_text,
        JSON.stringify(q.options),
        q.correct_option_index
      );
    }
    stmt.finalize((err) => (err ? reject(err) : resolve()));
  });
};

const create = ({ lesson_id, title, questions }) => {
  return new Promise((resolve, reject) => {
    db.serialize(async () => {
      try {
        const quizId = await new Promise((res, rej) => {
          db.run(
            "INSERT INTO quizzes (lesson_id, title) VALUES (?, ?)",
            [lesson_id, title],
            function (e) {
              if (e) return rej(e);
              res(this.lastID);
            }
          );
        });
        await _insertQuestions(quizId, questions);
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  });
};

const update = (quizId, { title, questions }) => {
  return new Promise((resolve, reject) => {
    db.serialize(async () => {
      try {
        await new Promise((res, rej) =>
          db.run(
            "UPDATE quizzes SET title = ? WHERE id = ?",
            [title, quizId],
            (e) => (e ? rej(e) : res())
          )
        );
        await new Promise((res, rej) =>
          db.run(
            "DELETE FROM quiz_questions WHERE quiz_id = ?",
            [quizId],
            (e) => (e ? rej(e) : res())
          )
        );
        await _insertQuestions(quizId, questions);
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  });
};

const remove = (id) => {
  return new Promise((resolve, reject) => {
    db.run("DELETE FROM quizzes WHERE id = ?", [id], (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
};

module.exports = {
  findByLessonId,
  getCorrectAnswers,
  getLessonIdForQuiz,
  findByLessonIdForAdmin,
  remove,
  update,
  create,
};
