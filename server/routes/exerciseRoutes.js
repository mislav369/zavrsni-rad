const express = require("express");
const router = express.Router();
const exerciseController = require("../controllers/exerciseController");
const { authenticateToken } = require("../middleware/authMiddleware");

router.get(
  "/:lessonId",
  authenticateToken,
  exerciseController.getExerciseByLessonId
);

router.post("/execute", authenticateToken, exerciseController.executeCode);

module.exports = router;
