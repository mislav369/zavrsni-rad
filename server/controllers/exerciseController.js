const exerciseModel = require("../models/exerciseModel");
const progressModel = require("../models/progressModel");

const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const { exec } = require("child_process");

const getExerciseByLessonId = async (req, res) => {
  try {
    const { lessonId } = req.params;
    const exercise = await exerciseModel.findByLessonId(lessonId);

    if (exercise) {
      res.status(200).json(exercise);
    } else {
      res.status(404).json({
        status: "fail",
        message: "Vježba za ovu lekciju nije pronađena.",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Greška pri dohvaćanju podataka o vježbi.",
    });
  }
};

const executeCode = async (req, res) => {
  const { code, exerciseId } = req.body;
  const userId = req.user.id;

  if (!code || !exerciseId) {
    return res.status(400).json({ error: "Kod i ID zadatka su obavezni." });
  }

  const tempDir = path.join(__dirname, "..", "..", "temp");
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir);
  }

  const filename = `${uuidv4()}.c`;
  const filepath = path.join(tempDir, filename);

  try {
    const exercise = await exerciseModel.findById(exerciseId);
    if (!exercise || !exercise.expected_output) {
      return res
        .status(404)
        .json({ error: "Zadatak ili očekivani izlaz nisu pronađeni." });
    }

    fs.writeFileSync(filepath, code);

    const executionResult = await new Promise((resolve, reject) => {
      const dockerCommand = `docker run --rm --memory="100m" --cpus="0.5" -v "${filepath}":/app/main.c -w /app gcc:11 sh -c "gcc main.c -o main.out && ./main.out"`;
      exec(dockerCommand, { timeout: 5000 }, (error, stdout, stderr) => {
        if (error) {
          return reject({
            details: "Greška pri izvršavanju.",
            output: stderr || error.message,
          });
        }
        resolve({ stdout, stderr });
      });
    });

    const isCorrect =
      executionResult.stdout.trim() === exercise.expected_output.trim();
    if (isCorrect) {
      await progressModel.saveExerciseProgress({ userId, exerciseId });

      await progressModel.checkAndUpdateLessonProgress(
        userId,
        exercise.lesson_id
      );
    }

    res.json({ output: executionResult.stdout, is_correct: isCorrect });
  } catch (error) {
    res.status(500).json({
      output: error.output || "Došlo je do interne pogreške.",
      is_correct: false,
      details: error.details || "Greška na serveru.",
    });
  } finally {
    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
    }
  }
};

module.exports = {
  getExerciseByLessonId,
  executeCode,
};
