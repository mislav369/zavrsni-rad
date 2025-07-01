const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { authenticateToken } = require("../middleware/authMiddleware");

router.get("/progress", authenticateToken, userController.getUserProgress);

router.get("/dashboard", authenticateToken, userController.getDashboardData);

module.exports = router;
