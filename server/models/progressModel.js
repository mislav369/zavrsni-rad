const db = require("../database.js");

const saveExerciseProgress = ({ userId, exerciseId }) => {
  const sql = `INSERT OR IGNORE INTO user_exercise_progress (user_id, exercise_id) VALUES (?, ?)`;
  return new Promise((resolve, reject) => {
    db.run(sql, [userId, exerciseId], (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
};

const saveQuizProgress = ({ userId, quizId }) => {
  const sql = `INSERT OR IGNORE INTO user_quiz_progress (user_id, quiz_id) VALUES (?, ?)`;
  return new Promise((resolve, reject) => {
    db.run(sql, [userId, quizId], (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
};

const getCompletedLessonIds = (userId) => {
  const sql = `SELECT lesson_id FROM user_lesson_progress WHERE user_id = ? AND is_complete = 1`;
  return new Promise((resolve, reject) => {
    db.all(sql, [userId], (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
};

const getCompletedCount = (userId) => {
  const sql = `SELECT COUNT(lesson_id) as count FROM user_lesson_progress WHERE user_id = ? AND is_complete = 1`;
  return new Promise((resolve, reject) => {
    db.get(sql, [userId], (err, row) =>
      err ? reject(err) : resolve(row.count)
    );
  });
};

const checkAndUpdateLessonProgress = async (userId, lessonId) => {
  const [
    [{ count: totalExercisesCount }],
    [{ count: totalQuizzesCount }],
    [{ count: completedExercisesCount }],
    [{ count: completedQuizzesCount }],
  ] = await Promise.all([
    new Promise((res, rej) =>
      db.all(
        "SELECT COUNT(id) as count FROM exercises WHERE lesson_id = ?",
        [lessonId],
        (e, r) => (e ? rej(e) : res(r))
      )
    ),
    new Promise((res, rej) =>
      db.all(
        "SELECT COUNT(id) as count FROM quizzes WHERE lesson_id = ?",
        [lessonId],
        (e, r) => (e ? rej(e) : res(r))
      )
    ),

    new Promise((res, rej) =>
      db.all(
        "SELECT COUNT(DISTINCT up.exercise_id) as count FROM user_exercise_progress up JOIN exercises e ON up.exercise_id = e.id WHERE up.user_id = ? AND e.lesson_id = ?",
        [userId, lessonId],
        (e, r) => (e ? rej(e) : res(r))
      )
    ),
    new Promise((res, rej) =>
      db.all(
        "SELECT COUNT(DISTINCT uqp.quiz_id) as count FROM user_quiz_progress uqp JOIN quizzes q ON uqp.quiz_id = q.id WHERE uqp.user_id = ? AND q.lesson_id = ?",
        [userId, lessonId],
        (e, r) => (e ? rej(e) : res(r))
      )
    ),
  ]);

  if (totalExercisesCount === 0 && totalQuizzesCount === 0) {
    return;
  }

  const isLessonComplete =
    totalExercisesCount === completedExercisesCount &&
    totalQuizzesCount === completedQuizzesCount;

  if (isLessonComplete) {
    const sql = `
      INSERT INTO user_lesson_progress (user_id, lesson_id, is_complete, completed_at)
      VALUES (?, ?, 1, datetime('now'))
      ON CONFLICT(user_id, lesson_id) DO UPDATE SET
      is_complete = 1, completed_at = datetime('now')
    `;
    return new Promise((resolve, reject) => {
      db.run(sql, [userId, lessonId], (err) => {
        if (err) return reject(err);
        resolve();
      });
    });
  }
};

module.exports = {
  saveExerciseProgress,
  saveQuizProgress,
  getCompletedLessonIds,
  getCompletedCount,
  checkAndUpdateLessonProgress,
};
