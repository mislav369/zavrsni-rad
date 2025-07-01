const lessonModel = require("../models/lessonModel");

const getAllLessons = async (req, res) => {
  try {
    const lessons = await lessonModel.getAll();
    res.status(200).json({ lessons });
  } catch (error) {
    console.error("Greška pri dohvaćanju svih lekcija:", error);
    res.status(500).json({
      message: "Greška pri dohvaćanju lekcija.",
    });
  }
};

const getLessonById = async (req, res) => {
  try {
    const { id } = req.params;
    const lesson = await lessonModel.findById(id);

    if (lesson) {
      res.status(200).json(lesson);
    } else {
      res.status(404).json({
        message: "Lekcija nije pronađena.",
      });
    }
  } catch (error) {
    console.error("Greška pri dohvaćanju lekcije:", error);
    res.status(500).json({
      message: "Greška pri dohvaćanju lekcije.",
    });
  }
};

const getNextLesson = async (req, res) => {
  try {
    const userId = req.user.id;
    const nextLesson = await lessonModel.findNextForUser(userId);
    res.status(200).json(nextLesson);
  } catch (error) {
    console.error("Greška pri dohvaćanju sljedeće lekcije:", error);
    res.status(500).json({ message: "Greška na serveru." });
  }
};

const getNextLessonByCurrent = async (req, res) => {
  try {
    const { id } = req.params;
    const nextLesson = await lessonModel.findNextByCurrentLessonId(id);
    res.status(200).json(nextLesson);
  } catch (error) {
    console.error("Greška pri dohvaćanju sljedeće lekcije po redu:", error);
    res.status(500).json({ message: "Greška na serveru." });
  }
};

module.exports = {
  getAllLessons,
  getLessonById,
  getNextLesson,
  getNextLessonByCurrent,
};
