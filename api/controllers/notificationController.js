const Notification = require("../models/notification");
const responseHelper = require("../helpers/responseHelper");

exports.getUserNotifications = async (req, res) => {
  try {
    const { userId } = req.user;
    const notifications = await Notification.find({
      user: userId,
      createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }, // Last 30 days
    }).sort({ createdAt: -1 });
    return responseHelper.success(res, notifications, "Success", 200);
  } catch (error) {
    return responseHelper.error(
      res,
      error,
      "Error fetching notifications",
      500
    );
  }
};

exports.updateSeenStatus = async (req, res) => {
  try {
    const { userId } = req.user;
    await Notification.updateMany({ user: userId }, { seen: true });
    return responseHelper.success(
      res,
      true,
      "Notifications marked as seen",
      200
    );
  } catch (error) {
    return responseHelper.error(
      res,
      error,
      "Error updating notifications",
      500
    );
  }
};

exports.deleteNotification = async (req, res) => {
  try {
    const deletedNotification = await Notification.findByIdAndDelete(
      req.params.id
    );
    if (!deletedNotification) {
      return responseHelper.error(res, null, "Notification not found", 404);
    }
    return responseHelper.success(
      res,
      true,
      "Notification deleted successfully",
      200
    );
  } catch (error) {
    return responseHelper.error(res, error, "Error deleting notification", 500);
  }
};
