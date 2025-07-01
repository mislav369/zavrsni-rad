const express = require("express");
const router = express.Router();
const adminRoutes = require("./adminRoutes");
const activityRoutes = require("./activityRoutes");
const authRoutes = require("./authRoutes");
const lessonRoutes = require("./lessonRoutes");
const exerciseRoutes = require("./exerciseRoutes");
const userRoutes = require("./userRoutes");
const quizRoutes = require("./quizRoutes");

router.use("/auth", authRoutes);
router.use("/lessons", lessonRoutes);
router.use("/", userRoutes);
router.use("/quiz", quizRoutes);
router.use("/activity", activityRoutes);
router.use("/exercises", exerciseRoutes);

router.use("/admin", adminRoutes);

module.exports = router;
