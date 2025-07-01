const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const {
  authenticateToken,
  authenticateAdmin,
} = require("../middleware/authMiddleware");

// --- Rute za Korisnike ---
router.get(
  "/users",
  authenticateToken,
  authenticateAdmin,
  adminController.getAllUsers
);

// --- Rute za Lekcije ---

router.get(
  "/lessons",
  authenticateToken,
  authenticateAdmin,
  adminController.getAllLessons
);
router.post(
  "/lessons",
  authenticateToken,
  authenticateAdmin,
  adminController.createLesson
);
router.get(
  "/lessons/:id",
  authenticateToken,
  authenticateAdmin,
  adminController.getLessonById
);
router.put(
  "/lessons/:id",
  authenticateToken,
  authenticateAdmin,
  adminController.updateLesson
);
router.delete(
  "/lessons/:id",
  authenticateToken,
  authenticateAdmin,
  adminController.deleteLesson
);

// --- Rute za Vježbe ---

router.get(
  "/lessons/:lessonId/exercise",
  authenticateToken,
  authenticateAdmin,
  adminController.getExerciseByLessonId
);

router.post(
  "/exercises",
  authenticateToken,
  authenticateAdmin,
  adminController.createExercise
);
router.put(
  "/exercises/:id",
  authenticateToken,
  authenticateAdmin,
  adminController.updateExercise
);
router.delete(
  "/exercises/:id",
  authenticateToken,
  authenticateAdmin,
  adminController.deleteExercise
);

// --- Rute za Kvizove ---

router.get(
  "/lessons/:lessonId/quiz",
  authenticateToken,
  authenticateAdmin,
  adminController.getQuizByLessonId
);

router.post(
  "/quiz",
  authenticateToken,
  authenticateAdmin,
  adminController.createQuiz
);
router.put(
  "/quiz/:id",
  authenticateToken,
  authenticateAdmin,
  adminController.updateQuiz
);
router.delete(
  "/quiz/:id",
  authenticateToken,
  authenticateAdmin,
  adminController.deleteQuiz
);

router.delete(
  "/users/:id",
  authenticateToken,
  authenticateAdmin,
  adminController.deleteUser
);

module.exports = router;
