const Follwer = require("../models/follower");
const FriendRequest = require("../models/friendRequest");
const Friends = require("../models/friend");
const responseHelper = require("../helpers/responseHelper");
const { list } = require("./postController");

exports.getFollowers = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * limit;

    const { userId } = req.user;

    console.log(userId);
    const followers = await Follwer.find({ user: userId })
      .populate("follower", ["name", "email", "profilePic"])
      .limit(limit)
      .skip(skip);
    console.log(followers);

    const total = await Follwer.countDocuments({ user: userId });

    const totalPages = Math.ceil(total / limit);

    const hasMore = page < totalPages;

    return responseHelper.success(
      res,
      { list: followers, page, totalPages, hasMore },
      "Success",
      200
    );
  } catch (error) {
    return responseHelper.error(res, error, "Error fetching followers", 500);
  }
};

exports.getFriendRequests = async (req, res) => {
  try {
    const friendRequest = await FriendRequest.find({ user: req.user._id });
    return responseHelper.success(res, friendRequest, "Success", 200);
  } catch (error) {
    return responseHelper.error(
      res,
      error,
      "Error fetching follower requests",
      500
    );
  }
};

exports.getFriends = async (req, res) => {
  try {
    const friends = await Friends.find({ user: req.user._id });
    return responseHelper.success(res, friends, "Success", 200);
  } catch (error) {
    return responseHelper.error(res, error, "Error fetching friends", 500);
  }
};
