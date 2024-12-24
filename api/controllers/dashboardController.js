const Notification = require("../models/notification");
const Friend = require("../models/friend");
const Follower = require("../models/follower");
const responseHelper = require("../helpers/responseHelper");

exports.getUnseenCounts = async (req, res) => {
  try {
    const { userId } = req.user;
    const notifications = await Notification.countDocuments({
      user: userId,
      seen: false,
    });
    const chats = await Friend.countDocuments({
      user: userId,
      unseenChat: true,
    });

    return responseHelper.success(
      res,
      { notifications, chats },
      "Success",
      200
    );
  } catch (error) {
    return responseHelper.error(
      res,
      error,
      "Error fetching notifications",
      500
    );
  }
};

exports.getFriends = async (req, res) => {
  try {
    const { userId } = req.user;
    const friends = await Friend.find({ user: userId })
      .populate("friend", "name pic username online thumbnail")
      .limit(7);
    return responseHelper.success(res, friends, "Success", 200);
  } catch (error) {
    return responseHelper.error(res, error, "Error fetching friends", 500);
  }
};
exports.getFollowers = async (req, res) => {
  try {
    const { userId } = req.user;
    const followers = await Follower.find({ user: userId })
      .populate("follower", "name pic username online thumbnail")
      .limit(5);
    const followersCount = await Follower.countDocuments({ user: userId });
    return responseHelper.success(
      res,
      { followers, followersCount },
      "Success",
      200
    );
  } catch (error) {
    return responseHelper.error(res, error, "Error fetching followers", 500);
  }
};
