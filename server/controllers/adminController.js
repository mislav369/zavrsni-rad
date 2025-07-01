const userModel = require("../models/userModel");
const lessonModel = require("../models/lessonModel");
const exerciseModel = require("../models/exerciseModel");
const quizModel = require("../models/quizModel");

const getAllUsers = async (req, res) => {
  try {
    const users = await userModel.getAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Greška pri dohvaćanju korisnika." });
  }
};

const getAllLessons = async (req, res) => {
  try {
    const lessons = await lessonModel.getAllForAdmin();
    res.json(lessons);
  } catch (error) {
    res.status(500).json({ error: "Greška pri dohvaćanju lekcija." });
  }
};

const createLesson = async (req, res) => {
  const { title, content, order_num } = req.body;
  if (!title || !content || order_num == null) {
    return res.status(400).json({ error: "Sva polja su obavezna." });
  }
  try {
    const newLessonId = await lessonModel.create({ title, content, order_num });
    res
      .status(201)
      .json({ id: newLessonId, message: "Lekcija uspješno kreirana." });
  } catch (error) {
    res.status(500).json({ error: "Greška pri kreiranju lekcije." });
  }
};

const getLessonById = async (req, res) => {
  try {
    const lesson = await lessonModel.findById(req.params.id); // Reusing findById
    if (lesson) {
      res.json(lesson);
    } else {
      res.status(404).json({ error: "Lekcija s tim ID-em nije pronađena." });
    }
  } catch (error) {
    res.status(500).json({ error: "Greška pri dohvaćanju lekcije." });
  }
};

const updateLesson = async (req, res) => {
  try {
    await lessonModel.update(req.params.id, req.body);
    res.json({ message: "Lekcija uspješno ažurirana." });
  } catch (error) {
    res.status(500).json({ error: "Greška pri ažuriranju lekcije." });
  }
};

const deleteLesson = async (req, res) => {
  try {
    const changes = await lessonModel.remove(req.params.id);
    if (changes === 0) {
      return res.status(404).json({ error: "Lekcija nije pronađena." });
    }
    res.json({ message: "Lekcija i sav povezani sadržaj su obrisani." });
  } catch (error) {
    res.status(500).json({ error: "Greška pri brisanju lekcije." });
  }
};

// === VJEŽBE (EXERCISES) ===

const getExerciseByLessonId = async (req, res) => {
  try {
    const exercise = await exerciseModel.findByLessonId(req.params.lessonId);
    res.json(exercise || null);
  } catch (error) {
    res.status(500).json({ error: "Greška pri dohvaćanju vježbe." });
  }
};

const createExercise = async (req, res) => {
  try {
    const newExerciseId = await exerciseModel.create(req.body);
    res
      .status(201)
      .json({ id: newExerciseId, message: "Vježba uspješno kreirana." });
  } catch (error) {
    res.status(500).json({ error: "Greška pri kreiranju vježbe." });
  }
};

const updateExercise = async (req, res) => {
  try {
    await exerciseModel.update(req.params.id, req.body);
    res.json({ message: "Vježba uspješno ažurirana." });
  } catch (error) {
    res.status(500).json({ error: "Greška pri ažuriranju vježbe." });
  }
};

const deleteExercise = async (req, res) => {
  try {
    await exerciseModel.remove(req.params.id);
    res.json({ message: "Vježba obrisana." });
  } catch (error) {
    res.status(500).json({ error: "Greška pri brisanju vježbe." });
  }
};

// === KVIZOVI (QUIZZES) ===

const getQuizByLessonId = async (req, res) => {
  try {
    const quiz = await quizModel.findByLessonIdForAdmin(req.params.lessonId);
    if (!quiz) {
      return res.json({
        id: null,
        title: "",
        questions: [],
      });
    }
    res.json(quiz);
  } catch (error) {
    console.error("❌ Greška u getQuizByLessonId:", error);
    res
      .status(500)
      .json({ error: "Greška pri dohvaćanju kviza.", details: error.message });
  }
};

const createQuiz = async (req, res) => {
  try {
    await quizModel.create(req.body);
    res.status(201).json({ message: "Kviz uspješno kreiran." });
  } catch (error) {
    res.status(500).json({ error: "Greška pri kreiranju kviza." });
  }
};

const updateQuiz = async (req, res) => {
  try {
    await quizModel.update(req.params.id, req.body);
    res.status(200).json({ message: "Kviz uspješno spremljen." });
  } catch (error) {
    res.status(500).json({ error: "Greška pri spremanju kviza." });
  }
};

const deleteQuiz = async (req, res) => {
  try {
    await quizModel.remove(req.params.id);
    res.json({ message: "Kviz je obrisan." });
  } catch (error) {
    res.status(500).json({ error: "Greška pri brisanju kviza." });
  }
};

const deleteUser = async (req, res) => {
  try {
    const changes = await userModel.remove(req.params.id);
    if (changes === 0) {
      return res.status(404).json({ error: "Korisnik nije pronađen." });
    }
    res.json({ message: "Korisnik uspješno obrisan." });
  } catch (error) {
    res.status(500).json({ error: "Greška pri brisanju korisnika." });
  }
};

module.exports = {
  getAllUsers,
  getAllLessons,
  createLesson,
  getLessonById,
  updateLesson,
  deleteLesson,
  getExerciseByLessonId,
  createExercise,
  updateExercise,
  deleteExercise,
  getQuizByLessonId,
  createQuiz,
  updateQuiz,
  deleteQuiz,
  deleteUser,
};
