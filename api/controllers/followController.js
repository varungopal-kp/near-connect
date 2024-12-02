const Follower = require("../models/follower");
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

    const followers = await Follower.find({ user: userId })
      .populate("follower", ["name", "email", "pic"])
      .limit(limit)
      .skip(skip);

    const total = await Follower.countDocuments({ user: userId });

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

    const followRequest = await FollowRequest.find({
      user: userId,
      status: "pending",
    })
      .populate("requestUser", ["name", "email", "pic"])
      .limit(limit)
      .skip(skip);

    const total = await FollowRequest.countDocuments({
      user: userId,
      status: "pending",
    });

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
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * limit;

    const { userId } = req.user;

    const friends = await Friend.find({ user: userId })
      .populate("friend", ["name", "email", "pic"])
      .limit(limit)
      .skip(skip);

    const total = await Friend.countDocuments({
      user: userId,
    });

    const totalPages = Math.ceil(total / limit);

    const hasMore = page < totalPages;

    return responseHelper.success(
      res,
      { list: friends, page, totalPages, hasMore },
      "Success",
      200
    );
  } catch (error) {
    return responseHelper.error(res, error, "Failed to get friends", 500);
  }
};

exports.removeFollower = async (req, res) => {
  try {
    const removeFollower = await Follower.findByIdAndDelete(req.params.id);
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
exports.confirmFriend = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    const { userId } = req.user;
    const isFollower = await Follower.findOne({
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
      await isFollower.deleteOne({ session }); //await is required to use session

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
exports.deleteFollowRequest = async (req, res) => {
  try {
    const followRequest = await FollowRequest.findOneAndUpdate(
      { _id: req.params.id, user: req.user.userId },
      {
        status: "rejected",
      }
    );
    if (!followRequest) {
      return responseHelper.error(res, null, "Request not found", 404);
    }

    return responseHelper.success(
      res,
      true,
      "Request removed successfully",
      200
    );
  } catch (error) {
    return responseHelper.error(res, error, "Failed to remove request", 500);
  }
};
exports.confirmFollowRequest = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    const followRequest = await FollowRequest.findOne({
      _id: req.params.id,
      user: req.user.userId,
    });
    if (!followRequest) {
      return responseHelper.error(res, null, "Request not found", 404);
    }
    session.startTransaction();
    const follower = await Follower.create(
      [
        {
          user: req.user.userId,
          follower: followRequest.requestUser,
        },
      ],
      { session }
    );
    if (follower) {
      await followRequest.deleteOne({ session });
      await session.commitTransaction();
      return responseHelper.success(
        res,
        true,
        "Request confirmed successfully",
        200
      );
    }
  } catch (error) {
    console.log(error);
    return responseHelper.error(res, error, "Failed to confirm request", 500);
  } finally {
    session.endSession();
  }
};

exports.getCounts = async (req, res) => {
  try {
    const { userId } = req.user;
    const followersCount = await Follower.countDocuments({
      user: userId,
    });
    const followRequestCount = await FollowRequest.countDocuments({
      user: userId,
      status: "pending",
    });
    const friendsCount = await Friend.countDocuments({ user: userId });
    return responseHelper.success(
      res,
      { followersCount, followRequestCount, friendsCount },
      "Success",
      200
    );
  } catch (error) {
    return responseHelper.error(res, error, "Failed to get follow count", 500);
  }
};

exports.removeFriend = async (req, res) => {
  try {
    const friend = await Friend.findByIdAndDelete(req.params.id);
    if (!friend) {
      return responseHelper.error(res, null, "Friend not found", 404);
    }
    return responseHelper.success(
      res,
      true,
      "Friend deleted successfully",
      200
    );
  } catch (error) {
    return responseHelper.error(res, error, "Failed to remove friend", 500);
  }
};
