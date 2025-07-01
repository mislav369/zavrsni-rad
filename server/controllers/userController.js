const progressModel = require("../models/progressModel");
const lessonModel = require("../models/lessonModel");
const activityModel = require("../models/activityModel");

const getUserProgress = async (req, res) => {
  try {
    const userId = req.user.id;
    const completedLessons = await progressModel.getCompletedLessonIds(userId);

    const completedLessonIds = completedLessons.map((row) => row.lesson_id);

    res.status(200).json(completedLessonIds);
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Greška pri dohvaćanju napretka korisnika.",
    });
  }
};

const getDashboardData = async (req, res) => {
  try {
    const userId = req.user.id;
    const name = req.user.name;

    const [
      totalLessons,
      completedLessons,
      nextLesson,
      lastCompletedLesson,
      activities,
    ] = await Promise.all([
      lessonModel.getTotalCount(),
      progressModel.getCompletedCount(userId),
      lessonModel.findNextForUser(userId),
      lessonModel.findLastCompletedForUser(userId),
      activityModel.getActivityDates(userId),
    ]);

    let streak = 0;
    if (activities.length > 0) {
      const uniqueDates = [
        ...new Set(activities.map((a) => a.activity_date)),
      ].sort((a, b) => new Date(b) - new Date(a));
      const today = new Date();
      const todayStr = today.toISOString().split("T")[0];
      const yesterday = new Date();
      yesterday.setDate(today.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split("T")[0];

      if (uniqueDates[0] === todayStr || uniqueDates[0] === yesterdayStr) {
        streak = 1;
        let currentDate = new Date(uniqueDates[0]);
        for (let i = 1; i < uniqueDates.length; i++) {
          currentDate.setDate(currentDate.getDate() - 1);
          const expectedDateStr = currentDate.toISOString().split("T")[0];
          if (uniqueDates[i] === expectedDateStr) {
            streak++;
          } else {
            break;
          }
        }
      }
    }

    res.json({
      name,
      totalLessons,
      completedLessons,
      nextLesson,
      lastCompletedLesson,
      streak,
    });
  } catch (error) {
    console.error("Greška pri dohvaćanju podataka za nadzornu ploču:", error);
    res
      .status(500)
      .json({ error: "Greška pri dohvaćanju podataka za nadzornu ploču." });
  }
};

module.exports = {
  getUserProgress,
  getDashboardData,
};
