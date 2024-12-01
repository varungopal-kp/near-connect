const Follwer = require("../models/follower");
const FollowRequest = require("../models/followRequest");
const Friend = require("../models/friend");
const responseHelper = require("../helpers/responseHelper");
const userActivityListener = require("../helpers/Listeners/userActivityListener");
const mongoose = require("mongoose");

exports.getFollowers = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * limit;

    const { userId } = req.user;

    const followers = await Follwer.find({ user: userId })
      .populate("follower", ["name", "email", "pic"])
      .limit(limit)
      .skip(skip);

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
    return responseHelper.error(res, error, "Failed to get followers", 500);
  }
};

exports.getFollowRequests = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * limit;

    const { userId } = req.user;

    const followRequest = await FollowRequest.find({ user: userId })
      .populate("requestUser", ["name", "email", "pic"])
      .limit(limit)
      .skip(skip);

    const total = await FollowRequest.countDocuments({ user: userId });

    const totalPages = Math.ceil(total / limit);

    const hasMore = page < totalPages;

    return responseHelper.success(
      res,
      { list: followRequest, page, totalPages, hasMore },
      "Success",
      200
    );
  } catch (error) {
    return responseHelper.error(
      res,
      error,
      "Failed to get follow requests",
      500
    );
  }
};

exports.getFriends = async (req, res) => {
  try {
    const friends = await Friend.find({ user: req.user._id });
    return responseHelper.success(res, friends, "Success", 200);
  } catch (error) {
    return responseHelper.error(res, error, "Failed to get friends", 500);
  }
};

exports.removeFollower = async (req, res) => {
  try {
    const removeFollower = await Follwer.findByIdAndDelete(req.params.id);
    if (!removeFollower) {
      return responseHelper.error(res, null, "Follower not found", 404);
    }
    return responseHelper.success(
      res,
      true,
      "Follower deleted successfully",
      200
    );
  } catch (error) {
    return responseHelper.error(res, error, "Failed to remove follower", 500);
  }
};
exports.addFriend = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    const { userId } = req.user;
    const isFollower = await Follwer.findOne({
      user: userId,
      follower: req.params.id,
    });
    if (!isFollower) {
      return responseHelper.error(res, null, "You are not a follower", 404);
    }
    session.startTransaction();

    const newfriend = await Friend.create(
      [
        {
          user: userId,
          friend: req.params.id,
        },
      ],
      { session }
    );

    if (newfriend) {
      await isFollower.deleteOne({ session })   //await is required to use session

      await session.commitTransaction();

      userActivityListener.emit("userActivity", {
        userId: req.user.userId,
        activity: "New Friend",
        associatedUserId: req.params.id,
      });

      return responseHelper.success(res, newfriend, "Success", 200);
    }
  } catch (error) {
    console.log(error);
    return responseHelper.error(res, error, "Failed to add friend", 500);
  } finally {
    session.endSession();
  }
};
