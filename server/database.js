const sqlite3 = require("sqlite3").verbose();
const fs = require("fs");
const path = require("path");

const DB_PATH = process.env.DB_PATH || "./db.sqlite";

const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error("Greška pri spajanju na bazu:", err.message);
    throw err;
  }
  console.log("Uspješno spojen na SQLite bazu podataka.");

  initializeDb();
});

async function initializeDb() {
  const run = (sql, params = []) =>
    new Promise((res, rej) =>
      db.run(sql, params, function (e) {
        e ? rej(e) : res(this);
      })
    );
  const get = (sql, params = []) =>
    new Promise((res, rej) =>
      db.get(sql, params, (e, r) => (e ? rej(e) : res(r)))
    );

  try {
    await run(
      `CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, first_name TEXT NOT NULL, last_name TEXT NOT NULL, email TEXT UNIQUE NOT NULL, password TEXT NOT NULL, is_admin INTEGER DEFAULT 0, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)`
    );
    await run(
      `CREATE TABLE IF NOT EXISTS lessons (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, content TEXT NOT NULL, order_num INTEGER)`
    );
    await run(
      `CREATE TABLE IF NOT EXISTS exercises (id INTEGER PRIMARY KEY AUTOINCREMENT, lesson_id INTEGER, title TEXT NOT NULL, description TEXT NOT NULL, template_code TEXT, expected_output TEXT, FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE)`
    );
    await run(
      `CREATE TABLE IF NOT EXISTS quizzes (id INTEGER PRIMARY KEY AUTOINCREMENT, lesson_id INTEGER UNIQUE, title TEXT NOT NULL, FOREIGN KEY (lesson_id) REFERENCES lessons (id) ON DELETE CASCADE)`
    );
    await run(
      `CREATE TABLE IF NOT EXISTS quiz_questions (id INTEGER PRIMARY KEY AUTOINCREMENT, quiz_id INTEGER NOT NULL, question_text TEXT NOT NULL, options TEXT NOT NULL, correct_option_index INTEGER NOT NULL, FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE)`
    );
    await run(
      `CREATE TABLE IF NOT EXISTS user_exercise_progress (user_id INTEGER NOT NULL, exercise_id INTEGER NOT NULL, completed_at DATETIME DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY (user_id, exercise_id), FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE, FOREIGN KEY (exercise_id) REFERENCES exercises(id) ON DELETE CASCADE)`
    );
    await run(
      `CREATE TABLE IF NOT EXISTS user_activity (user_id INTEGER NOT NULL, activity_date DATE NOT NULL, PRIMARY KEY (user_id, activity_date), FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE)`
    );
    await run(
      `CREATE TABLE IF NOT EXISTS user_quiz_progress (user_id INTEGER NOT NULL, quiz_id INTEGER NOT NULL, completed_at DATETIME DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY (user_id, quiz_id), FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE, FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE)`
    );
    await run(
      `CREATE TABLE IF NOT EXISTS user_lesson_progress (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER NOT NULL, lesson_id INTEGER NOT NULL, is_complete INTEGER NOT NULL DEFAULT 0, completed_at DATETIME, FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE, FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE, UNIQUE(user_id, lesson_id))`
    );

    console.log("Struktura svih tablica provjerena/kreirana.");

    const lessons = await get("SELECT COUNT(*) as count FROM lessons");

    if (lessons.count === 0) {
      console.log("Baza je prazna, pokrećem punjenje iz seed-data.json...");

      const seedDataPath = path.join(__dirname, "seed-data.json");
      const seedData = JSON.parse(fs.readFileSync(seedDataPath));

      await run("BEGIN TRANSACTION");

      for (const lesson of seedData.lessons) {
        await run(
          "INSERT INTO lessons (id, title, content, order_num) VALUES (?, ?, ?, ?)",
          [lesson.id, lesson.title, lesson.content, lesson.order_num]
        );
      }

      for (const exercise of seedData.exercises) {
        await run(
          "INSERT INTO exercises (lesson_id, title, description, template_code, expected_output) VALUES (?, ?, ?, ?, ?)",
          [
            exercise.lesson_id,
            exercise.title,
            exercise.description,
            exercise.template_code,
            exercise.expected_output,
          ]
        );
      }

      for (const quiz of seedData.quizzes) {
        const result = await run(
          "INSERT INTO quizzes (lesson_id, title) VALUES (?, ?)",
          [quiz.lesson_id, quiz.title]
        );
        const quizId = result.lastID;

        for (const q of quiz.questions) {
          await run(
            "INSERT INTO quiz_questions (quiz_id, question_text, options, correct_option_index) VALUES (?, ?, ?, ?)",
            [
              quizId,
              q.question_text,
              JSON.stringify(q.options),
              q.correct_option_index,
            ]
          );
        }
      }

      await run("COMMIT");
      console.log("Punjenje baze iz JSON-a uspješno završeno.");
    } else {
      console.log("Baza već sadrži podatke, preskačem punjenje.");
    }
  } catch (e) {
    console.error("Dogodila se greška tijekom inicijalizacije baze:", e);

    try {
      await run("ROLLBACK");
      console.log("Transakcija neuspješna, izvršen ROLLBACK.");
    } catch (rollbackErr) {
      console.error("Greška pri ROLLBACK-u:", rollbackErr);
    }
  }
}

module.exports = db;
