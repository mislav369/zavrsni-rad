const express = require("express");
const router = express.Router();
const quizController = require("../controllers/quizController");
const { authenticateToken } = require("../middleware/authMiddleware");

router.get("/:lessonId", authenticateToken, quizController.getQuizByLessonId);

router.post("/submit", authenticateToken, quizController.submitQuiz);

module.exports = router;
