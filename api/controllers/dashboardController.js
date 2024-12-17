const Notification = require("../models/notification");
const responseHelper = require("../helpers/responseHelper");

exports.getUnseenCounts = async (req, res) => {
  try {
    const { userId } = req.user;
    const notifications = await Notification.countDocuments({
      user: userId,
      seen: false,
    });
    return responseHelper.success(res, { notifications }, "Success", 200);
  } catch (error) {
    return responseHelper.error(
      res,
      error,
      "Error fetching notifications",
      500
    );
  }
};

