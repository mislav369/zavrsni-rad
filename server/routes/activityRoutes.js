const express = require("express");
const router = express.Router();
const activityController = require("../controllers/activityController");
const { authenticateToken } = require("../middleware/authMiddleware");

router.post("/log", authenticateToken, activityController.logActivity);

module.exports = router;
