const express = require("express");
const router = express.Router();
const lessonController = require("../controllers/lessonController");
const { authenticateToken } = require("../middleware/authMiddleware");

router.get("/", authenticateToken, lessonController.getAllLessons);
router.get("/next", authenticateToken, lessonController.getNextLesson);
router.get("/:id", authenticateToken, lessonController.getLessonById);
router.get(
  "/:id/next",
  authenticateToken,
  lessonController.getNextLessonByCurrent
);

module.exports = router;
