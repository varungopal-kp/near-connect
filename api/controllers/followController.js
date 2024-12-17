const Follower = require("../models/follower");
const FollowRequest = require("../models/followRequest");
const Friend = require("../models/friend");
const responseHelper = require("../helpers/responseHelper");
const userActivityListener = require("../helpers/Events/userActivityListener");
const mongoose = require("mongoose");
const User = require("../models/user");
const { convertToObjectId } = require("../helpers/mongoUtils");

exports.getFollowers = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * limit;

    const { userId } = req.user;
    let user = userId;
    if (req.query.user) user = req.query.user;

    const followers = await Follower.find({ user: user })
      .populate("follower", ["name", "email", "pic", "username"])
      .limit(limit)
      .skip(skip);

    const total = await Follower.countDocuments({ user: user });

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

    let user = userId;
    if (req.query.user) user = req.query.user;

    const followRequest = await FollowRequest.find({
      user: user,
      status: "pending",
    })
      .populate("requestUser", ["name", "email", "pic", "username"])
      .limit(limit)
      .skip(skip);

    const total = await FollowRequest.countDocuments({
      user: user,
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
    let user = userId;
    if (req.query.user) user = req.query.user;

    const friends = await Friend.find({
      user: user,
    })
      .populate("friend", ["name", "email", "pic", "username"])
      .limit(limit)
      .skip(skip);

    const total = await Friend.countDocuments({
      user: user,
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
  const session = await mongoose.startSession();
  try {
    const removeFollower = await Follower.findByIdAndDelete(req.params.id);
    if (!removeFollower) {
      return responseHelper.error(res, null, "Follower not found", 404);
    }
    session.startTransaction();

    await User.findByIdAndUpdate(removeFollower.user, {
      $inc: { followersCount: -1 },
    }).session(session);

    await session.commitTransaction();

    return responseHelper.success(
      res,
      true,
      "Follower deleted successfully",
      200
    );
  } catch (error) {
    console.log(error);
    return responseHelper.error(res, error, "Failed to remove follower", 500);
  } finally {
    session.endSession();
  }
};
exports.confirmFriend = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    const { userId } = req.user;

    // Start the transaction
    session.startTransaction();

    // Check if the user is a follower
    const isFollower = await Follower.findOne({
      user: userId,
      follower: req.params.id,
    }).session(session);
    if (!isFollower) {
      return responseHelper.error(res, null, "You are not a follower", 404);
    }

    // Create new friends
    const newFriends = await Friend.create(
      [
        { user: userId, friend: req.params.id },
        { user: req.params.id, friend: userId },
      ],
      { session }
    );

    // Delete the follower record
    await isFollower.deleteOne({ session });

    // Update users' friend and follower counts
    await User.updateMany(
      { _id: { $in: [userId, req.params.id] } },
      { $inc: { friendsCount: 1 } },
      { session }
    );

    await User.findByIdAndUpdate(
      userId,
      { $inc: { followersCount: -1 } },
      { session }
    );

    await session.commitTransaction();

    userActivityListener.emit("userActivity", {
      userId,
      type: "newFriend",
      data: { associatedUserId: req.params.id },
    });

    return responseHelper.success(res, newFriends, "Success", 200);
  } catch (error) {
    console.error("Transaction Error:", error);
    return responseHelper.error(res, error, "Failed to add friend", 500);
  } finally {
    session.endSession();
  }
};

exports.deleteFollowRequest = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    const { userId } = req.user;
    session.startTransaction();

    const followRequest = await FollowRequest.findOneAndUpdate(
      { _id: req.params.id, user: userId },
      {
        status: "rejected",
      }
    ).session(session);
    if (!followRequest) {
      return responseHelper.error(res, null, "Request not found", 404);
    }

    await User.findByIdAndUpdate(userId, {
      $inc: { requestsCount: -1 },
    }).session(session);

    await session.commitTransaction();

    return responseHelper.success(
      res,
      true,
      "Request removed successfully",
      200
    );
  } catch (error) {
    return responseHelper.error(res, error, "Failed to remove request", 500);
  } finally {
    session.endSession();
  }
};

exports.addFollowRequest = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    const { userId } = req.user;
    session.startTransaction();

    const isAlreadyRequest = await FollowRequest.findOne({
      user: req.params.id,
      requestUser: userId,
    }).session(session);

    if (isAlreadyRequest) {
      return responseHelper.error(res, null, "Request already sent", 400);
    }
    const followRequest = await FollowRequest.create(
      [
        {
          user: req.params.id,
          requestUser: userId,
        },
      ],
      { session }
    );
    if (followRequest) {
      await User.findByIdAndUpdate(req.params.id, {
        $inc: { requestsCount: 1 },
      }).session(session);

      await session.commitTransaction();

      return responseHelper.success(
        res,
        followRequest,
        "Request sent successfully",
        201
      );
    }
  } catch (error) {
    return responseHelper.error(res, error, "Failed to send request", 500);
  }
};

exports.confirmFollowRequest = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    const { userId } = req.user;
    session.startTransaction();

    const followRequest = await FollowRequest.findOne({
      _id: req.params.id,
      user: userId,
    }).session(session);

    if (!followRequest) {
      return responseHelper.error(res, null, "Follow request not found", 400);
    }

    const follower = await Follower.create(
      [
        {
          user: userId,
          follower: followRequest.requestUser,
        },
      ],
      { session }
    );
    if (follower) {
      await followRequest.deleteOne({ session });

      await User.findByIdAndUpdate(userId, {
        $inc: { followersCount: 1, requestsCount: -1 },
      }).session(session);

      await session.commitTransaction();

      return responseHelper.success(
        res,
        true,
        "Request confirmed successfully",
        200
      );
    }
  } catch (error) {
    return responseHelper.error(res, error, "Failed to confirm request", 500);
  } finally {
    session.endSession();
  }
};

exports.removeFriend = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    const { userId } = req.user;

    session.startTransaction();

    const isFriend = await Friend.findOne({
      user: userId,
      friend: req.params.id,
    });

    if (!isFriend) {
      return responseHelper.error(res, null, "You are not a friend", 400);
    }
    await Friend.deleteMany({
      $or: [
        { user: userId, friend: req.params.id },
        { friend: userId, user: req.params.id },
      ],
    }).session(session);

    await User.updateMany(
      { _id: { $in: [userId, req.params.id] } },
      {
        $inc: { friendsCount: -1 },
      }
    ).session(session);

    await session.commitTransaction();

    return responseHelper.success(
      res,
      true,
      "Friend deleted successfully",
      200
    );
  } catch (error) {
    return responseHelper.error(res, error, "Failed to remove friend", 500);
  } finally {
    session.endSession();
  }
};

exports.getCounts = async (req, res) => {
  try {
    const { userId } = req.user;
    let user = userId;
    if (req.query.user) user = req.query.user;

    const followersCount = await Follower.countDocuments({
      user: user,
    });
    const followRequestCount = await FollowRequest.countDocuments({
      user: user,
      status: "pending",
    });
    const friendsCount = await Friend.countDocuments({ user: user });
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

// old schema with on entry per user
exports.getFollowUserDetails2 = async (req, res) => {
  try {
    const { userId } = req.user;
    const { username } = req.params;

    const user = await User.aggregate([
      {
        $match: {
          username: username,
        },
      },
      {
        $lookup: {
          from: "images",
          localField: "_id",
          foreignField: "user",
          as: "images",
        },
      },
      {
        $lookup: {
          from: "followers",
          localField: "_id",
          foreignField: "user",
          as: "followers",
        },
      },

      {
        $lookup: {
          from: "followers",
          localField: "_id",
          foreignField: "follower",
          as: "following",
        },
      },

      {
        $lookup: {
          from: "followrequests",
          localField: "_id",
          foreignField: "requestUser",
          as: "requestedUsers",
        },
      },

      {
        $lookup: {
          from: "friends",
          let: { userId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $or: [
                    { $eq: ["$user", "$$userId"] }, // Match if `user` equals `_id`
                    { $eq: ["$friend", "$$userId"] }, // Match if `friend` equals `_id`
                  ],
                },
              },
            },
          ],
          as: "friends",
        },
      },
      {
        $addFields: {
          userRelation: {
            $cond: [
              {
                $gt: [
                  {
                    $size: {
                      $filter: {
                        input: "$friends",
                        as: "friend",
                        cond: {
                          $or: [
                            {
                              $eq: ["$$friend.user", convertToObjectId(userId)],
                            }, // Check if `req.user._id` matches `user`
                            {
                              $eq: [
                                "$$friend.friend",
                                convertToObjectId(userId),
                              ],
                            }, // Check if `req.user._id` matches `friend`
                          ],
                        },
                      },
                    },
                  },
                  0,
                ],
              },
              "friends", // If there is a match, relation is `friends`
              {
                $cond: [
                  {
                    $gt: [
                      {
                        $size: {
                          $filter: {
                            input: "$following",
                            as: "following",
                            cond: {
                              $eq: [
                                "$$following.user",
                                convertToObjectId(userId),
                              ],
                            },
                          },
                        },
                      },
                      0,
                    ],
                  },
                  "follower",
                  {
                    $cond: [
                      {
                        $gt: [
                          {
                            $size: {
                              $filter: {
                                input: "$requestedUsers",
                                as: "requestedUsers",
                                cond: {
                                  $eq: [
                                    "$$requestedUsers.user",
                                    convertToObjectId(userId),
                                  ],
                                },
                              },
                            },
                          },
                          0,
                        ],
                      },
                      "requested",
                      "no relation",
                    ],
                  },
                ],
              },
            ],
          },
        },
      },
      {
        $addFields: {
          friendsCount: { $size: "$friends" }, // Add a field to count the number of friends
        },
      },
      {
        $addFields: {
          followersCount: { $size: "$followers" }, // Add a field to count the number of followers
        },
      },
      {
        $project: {
          password: 0,
          recentActivity: 0,
          fcmToken: 0,
          friends: 0,
          followers: 0,
          following: 0,
          requestedUsers: 0,
        },
      },
    ]);
    if (!user || user.length === 0) {
      return responseHelper.error(res, null, "User not found", 404);
    }
    return responseHelper.success(res, user[0], "Success", 200);
  } catch (error) {
    console.log(error);
    return responseHelper.error(res, error, "Failed to get user details", 500);
  }
};

exports.getFollowUserDetails = async (req, res) => {
  try {
    const { userId } = req.user;
    const { username } = req.params;

    const user = await User.aggregate([
      {
        $match: {
          username: username,
        },
      },
      {
        $lookup: {
          from: "images",
          localField: "_id",
          foreignField: "user",
          as: "images",
        },
      },
      {
        $lookup: {
          from: "followers",
          localField: "_id",
          foreignField: "user",
          as: "followers",
        },
      },

      {
        $lookup: {
          from: "followers",
          localField: "_id",
          foreignField: "follower",
          as: "following",
        },
      },

      {
        $lookup: {
          from: "followrequests",
          localField: "_id",
          foreignField: "user",
          as: "requestedUsers",
        },
      },

      {
        $lookup: {
          from: "friends",
          localField: "_id",
          foreignField: "user",
          as: "friends",
        },
      },
      {
        $lookup: {
          from: "blockedusers",
          localField: "_id",
          foreignField: "blockedUser",
          as: "blockedByuser",
        },
      },
      {
        $lookup: {
          from: "blockedusers",
          localField: "_id",
          foreignField: "user",
          as: "blocked",
        },
      },
      {
        $addFields: {
          blockedByYou: {
            $cond: [
              {
                $gt: [
                  {
                    $size: {
                      $filter: {
                        input: "$blockedByuser",
                        as: "blockedByuser",
                        cond: {
                          $eq: [
                            "$$blockedByuser.user",
                            convertToObjectId(userId),
                          ],
                        },
                      },
                    },
                  },
                  0,
                ],
              },
              true,
              false,
            ],
          },
        },
      },
      {
        $addFields: {
          blockedByHim: {
            $cond: [
              {
                $gt: [
                  {
                    $size: {
                      $filter: {
                        input: "$blocked",
                        as: "blocked",
                        cond: {
                          $eq: [
                            "$$blocked.blockedUser",
                            convertToObjectId(userId),
                          ],
                        },
                      },
                    },
                  },
                  0,
                ],
              },
              true,
              false,
            ],
          },
        },
      },
      {
        $addFields: {
          userRelation: {
            $cond: [
              {
                $gt: [
                  {
                    $size: {
                      $filter: {
                        input: "$friends",
                        as: "friend",
                        cond: {
                          $eq: ["$$friend.friend", convertToObjectId(userId)],
                        },
                      },
                    },
                  },
                  0,
                ],
              },
              "friends", // If there is a match, relation is `friends`
              {
                $cond: [
                  {
                    $gt: [
                      {
                        $size: {
                          $filter: {
                            input: "$following",
                            as: "following",
                            cond: {
                              $eq: [
                                "$$following.user",
                                convertToObjectId(userId),
                              ],
                            },
                          },
                        },
                      },
                      0,
                    ],
                  },
                  "follower",
                  {
                    $cond: [
                      {
                        $gt: [
                          {
                            $size: {
                              $filter: {
                                input: "$followers",
                                as: "followers",
                                cond: {
                                  $eq: [
                                    "$$followers.follower",
                                    convertToObjectId(userId),
                                  ],
                                },
                              },
                            },
                          },
                          0,
                        ],
                      },
                      "following",
                      {
                        $cond: [
                          {
                            $gt: [
                              {
                                $size: {
                                  $filter: {
                                    input: "$requestedUsers",
                                    as: "requestedUsers",
                                    cond: {
                                      $eq: [
                                        "$$requestedUsers.requestUser",
                                        convertToObjectId(userId),
                                      ],
                                    },
                                  },
                                },
                              },
                              0,
                            ],
                          },
                          "requested",
                          "no relation",
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        },
      },

      {
        $project: {
          password: 0,
          recentActivity: 0,
          fcmToken: 0,
          friends: 0,
          followers: 0,
          following: 0,
          requestedUsers: 0,
          blockedByuser: 0,
          blocked: 0,
        },
      },
    ]);

    if (!user || user.length === 0) {
      return responseHelper.error(res, null, "User not found", 404);
    }
    return responseHelper.success(res, user[0], "Success", 200);
  } catch (error) {
    return responseHelper.error(res, error, "Failed to get user details", 500);
  }
};
