const activityModel = require("../models/activityModel");

const logActivity = async (req, res) => {
  try {
    const userId = req.user.id;
    await activityModel.logUserActivity(userId);
    res.sendStatus(200);
  } catch (error) {
    res.sendStatus(500);
  }
};

module.exports = {
  logActivity,
};
