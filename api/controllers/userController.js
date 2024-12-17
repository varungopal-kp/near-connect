const User = require("../models/user");
const Follower = require("../models/follower");
const FollowRequest = require("../models/followRequest");
const Friend = require("../models/friend");
const BlockedUser = require("../models/blockedUser");
const responseHelper = require("../helpers/responseHelper");
const { convertToObjectId } = require("../helpers/mongoUtils");
const { geocode } = require("../helpers/geoCodeHelper");
const mongoose = require("mongoose");

// Create a new user
exports.createUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const newUser = new User({ username, email, password });

    // Save the user to the database
    await newUser.save();
    return responseHelper.success(
      res,
      newUser,
      "User created successfully",
      201
    );
  } catch (error) {
    return responseHelper.error(res, error, "Error creating user", 500);
  }
};

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    return responseHelper.success(res, users, "Success", 200);
  } catch (error) {
    return responseHelper.error(res, error, "Error fetching users", 500);
  }
};

// Get a single user by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return responseHelper.error(res, null, "User not found", 404);
    }
    return responseHelper.success(res, user, "Success", 200);
  } catch (error) {
    return responseHelper.error(res, error, "Error fetching user", 500);
  }
};

// Get user profile
exports.getUserProfile = async (req, res) => {
  try {
    const { userId } = req.user;
    // const lat = await geocode("683511");
    // console.log(lat);
    const user = await User.aggregate([
      {
        $match: {
          _id: convertToObjectId(userId),
        },
      },
      {
        $unwind: {
          path: "$recentActivity",
          preserveNullAndEmptyArrays: true, // Preserve the document even if recentActivity is empty
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "recentActivity.associatedUser",
          foreignField: "_id",
          as: "recentActivity.associatedUser",
          pipeline: [
            {
              $project: {
                _id: 1,
                name: 1,
                email: 1,
              },
            },
          ],
        },
      },
      {
        $unwind: {
          path: "$recentActivity.associatedUser",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: "$_id",
          name: { $first: "$name" },
          lastName: { $first: "$lastName" },
          email: { $first: "$email" },
          pic: { $first: "$pic" },
          username: { $first: "$username" },
          backgroundPic: { $first: "$backgroundPic" },
          friendsCount: { $first: "$friendsCount" },
          followersCount: { $first: "$followersCount" },
          requestsCount: { $first: "$requestsCount" },
          about: { $first: "$about" },
          dob: { $first: "$dob" },
          place: { $first: "$place" },
          pincode: { $first: "$pincode" },
          gender: { $first: "$gender" },
          recentActivity: { $push: "$recentActivity" },
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          lastName: 1,
          email: 1,
          username: 1,
          pic: 1,
          backgroundPic: 1,
          friendsCount: 1,
          followersCount: 1,
          requestsCount: 1,
          about: 1,
          place: 1,
          dob: 1,
          gender: 1,
          pincode: 1,
          recentActivity: {
            $filter: {
              input: "$recentActivity",
              as: "activity",
              cond: {
                $and: [
                  { $ne: ["$$activity", {}] }, // Exclude empty objects
                  { $ne: ["$$activity.associatedUser", null] }, // Exclude if associatedUser is null
                ],
              },
            },
          },
        },
      },
      {
        $limit: 1, // Limit to 1 document to improve little performance
      },
    ]);
    if (!user || user.length === 0) {
      return responseHelper.error(res, null, "User not found", 400);
    }
    return responseHelper.success(res, user[0], "Success", 200);
  } catch (error) {
    console.log(error);
    return responseHelper.error(res, error, "Error fetching user", 500);
  }
};

// Update a user by ID
exports.updateUser = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedUser) {
      return responseHelper.validationError(res, errors, "Invalid input data");
    }
    return responseHelper.success(
      res,
      updatedUser,
      "User updated successfully",
      200
    );
  } catch (error) {
    return responseHelper.error(res, error, "Error updating user", 500);
  }
};

// Delete a user by ID
exports.deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return responseHelper.error(res, null, "User not found", 404);
    }
    return responseHelper.success(res, null, "User deleted successfully", 200);
  } catch (error) {
    return responseHelper.error(res, error, "Error deleting user", 500);
  }
};

// Search user by name or username
exports.searchUsers = async (req, res) => {
  try {
    const { userId } = req.user;
    const searchValue = req.query.search;
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * limit;

    if (!searchValue) {
      return responseHelper.error(res, null, "Search value is required", 400);
    }

    const list = await User.aggregate([
      {
        $match: {
          $or: [
            { name: { $regex: searchValue, $options: "i" } },
            { username: { $regex: searchValue, $options: "i" } },
          ],
          _id: { $ne: convertToObjectId(userId) },
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
          friends: 0,
          followers: 0,
          following: 0,
        },
      }, // Exclude intermediate fields
      { $skip: skip },
      { $limit: limit },
    ]);

    const totalItems = await User.countDocuments({
      $or: [
        { name: { $regex: searchValue, $options: "i" } },
        { username: { $regex: searchValue, $options: "i" } },
      ],
      _id: { $ne: convertToObjectId(userId) },
    });

    const totalPages = Math.ceil(totalItems / limit);
    const hasMore = skip + limit < totalItems;

    return responseHelper.success(
      res,
      {
        list,
        totalPages,
        totalItems,
        currentPage: page,
        hasMore,
      },
      "Successful",
      200
    );
  } catch (error) {
    console.log(error);
    return responseHelper.error(res, error, "Error searching users", 500);
  }
};
exports.updateProfileImage = async (req, res) => {
  try {
    const { userId } = req.user;
    const { type } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return responseHelper.error(res, null, "User not found", 404);
    }
    if (type === "profile") {
      user.pic = req.file.path;
    } else {
      user.backgroundPic = req.file.path;
    }
    await user.save();
    return responseHelper.success(res, user, "Profile image updated", 200);
  } catch (error) {
    console.log(error);
    return responseHelper.error(
      res,
      error,
      "Error updating profile image",
      500
    );
  }
};
exports.updateProfile = async (req, res) => {
  try {
    const { userId } = req.user;
    const data = req.body;
    const user = await User.findById(userId);

    if (!user) {
      return responseHelper.error(res, null, "User not found", 404);
    }

    user.name = data.name;
    user.about = data.about;
    user.lastName = data.lastName;
    user.place = data.place;
    user.gender = data.gender;
    user.pincode = data.pincode;
    user.dob = data.dob;

    await user.save();
    return responseHelper.success(res, user, "Profile updated", 200);
  } catch (error) {
    return responseHelper.error(res, error, "Error updating profile", 500);
  }
};
exports.getNearbyUsers = async (req, res) => {
  try {
    const { userId } = req.user;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const user = await User.findById(userId);
    if (!user) {
      return responseHelper.error(res, null, "User not found", 404);
    }

    const list = await User.find({
      location: {
        $near: {
          $geometry: { type: "Point", coordinates: user.location.coordinates },
          $maxDistance: 50000, // 50km
        },
      },
      _id: { $ne: userId },
    })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);
    let totalItems = await User.find({
      location: {
        $near: {
          $geometry: { type: "Point", coordinates: user.location.coordinates },
          $maxDistance: 50000, // 50km
        },
      },
      _id: { $ne: userId },
    });
    totalItems = totalItems?.length || 0;
    const totalPages = Math.ceil(totalItems / limit);
    const hasMore = skip + limit < totalItems;

    return responseHelper.success(
      res,
      {
        list,
        totalPages,
        totalItems,
        currentPage: page,
        hasMore,
      },
      "Successfull",
      200
    );
  } catch (error) {
    console.log(error);
    return responseHelper.error(res, error, "Error getting nearby users", 500);
  }
};
exports.blockUser = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    const { userId } = req.user;
    const { blockUserId } = req.body;

    session.startTransaction();

    const blockedUser = await User.findById(blockUserId).session(session);
    if (!blockedUser) {
      return responseHelper.error(res, null, "User not found", 400);
    }

    const blockedUserExists = await BlockedUser.findOne({
      user: userId,
      blockedUser: blockUserId,
    }).session(session);

    if (blockedUserExists) {
      return responseHelper.error(res, null, "User already blocked", 400);
    }

    const isFriend = await Friend.exists({
      user: userId,
      friend: blockUserId,
    }).session(session);
    const isFollower = await Follower.exists({
      user: userId,
      follower: blockUserId,
    }).session(session);
    const isFollowing = await Follower.exists({
      user: blockUserId,
      follower: userId,
    }).session(session);
    const hasSentRequest = await FollowRequest.exists({
      user: userId,
      requestUser: blockUserId,
    }).session(session);
    const hasReceivedRequest = await FollowRequest.exists({
      user: blockUserId,
      requestUser: userId,
    }).session(session);

    await BlockedUser.create(
      [
        {
          user: userId,
          blockedUser: blockUserId,
          friends: !!isFriend,
          followers: !!isFollower,
          following: !!isFollowing,
          sendRequest: !!hasSentRequest,
          reveivedRequest: !!hasReceivedRequest,
        },
      ],
      { session }
    );

    if (isFriend) {
      await Friend.deleteMany([
        { user: userId, friend: blockUserId },
        { user: blockUserId, friend: userId },
      ]).session(session);
      await User.updateMany(
        { _id: { $in: [userId, blockUserId] } },
        {
          $inc: { friendsCount: -1 },
        }
      ).session(session);
    }
    if (isFollower) {
      await Followers.deleteOne({
        user: userId,
        follower: blockUserId,
      }).session(session);
      await User.findByIdAndUpdate(userId, {
        $inc: { followersCount: -1 },
      }).session(session);
    }
    if (isFollowing) {
      await Followers.deleteOne({
        user: blockUserId,
        follower: userId,
      }).session(session);
      await User.findByIdAndUpdate(blockUserId, {
        $inc: { followersCount: -1 },
      }).session(session);
    }
    if (hasSentRequest) {
      await FollowRequest.deleteOne({
        user: userId,
        requestUser: blockUserId,
      }).session(session);
      await User.findByIdAndUpdate(userId, {
        $inc: { requestsCount: -1 },
      }).session(session);
    }
    if (hasReceivedRequest) {
      await FollowRequest.deleteOne({
        user: blockUserId,
        requestUser: userId,
      }).session(session);
      await User.findByIdAndUpdate(blockUserId, {
        $inc: { requestsCount: -1 },
      }).session(session);
    }

    await session.commitTransaction();

    return responseHelper.success(res, true, "User blocked successfully", 200);
  } catch (error) {
    console.log(error);
    return responseHelper.error(res, error, "Error blocking user", 500);
  } finally {
    await session.endSession();
  }
};

exports.unblockUser = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    const { userId } = req.user;
    const { blockUserId } = req.body;

    session.startTransaction();

    // Check if the blocked user exists
    const blockedUser = await User.findById(blockUserId).session(session);
    if (!blockedUser) {
      return responseHelper.error(res, null, "User not found", 400);
    }

    // Check if the user has blocked this user
    const blockedUserExists = await BlockedUser.findOne({
      user: userId,
      blockedUser: blockUserId,
    }).session(session);

    if (!blockedUserExists) {
      return responseHelper.error(res, null, "User is not blocked", 400);
    }

    // Remove the blocked user relationship
    await BlockedUser.deleteOne({
      user: userId,
      blockedUser: blockUserId,
    }).session(session);

    // Restore the relationships if they existed before blocking
    if (blockedUserExists.friends) {
      // Restore friendship
      await Friend.create(
        [
          { user: userId, friend: blockUserId },
          { user: blockUserId, friend: userId },
        ],
        {
          session,
        }
      );
      await User.updateMany(
        { _id: { $in: [userId, blockUserId] } },
        {
          $inc: { friendsCount: 1 },
        }
      ).session(session);
    }

    if (blockedUserExists.followers) {
      // Restore follower relationship
      await Followers.create(
        [
          {
            user: userId,
            follower: blockUserId,
          },
        ],
        {
          session,
        }
      );
      await User.findByIdAndUpdate(userId, {
        $inc: { followersCount: 1 },
      }).session(session);
    }

    if (blockedUserExists.following) {
      // Restore following relationship
      await Followers.create(
        [
          {
            user: blockUserId,
            follower: userId,
          },
        ],
        {
          session,
        }
      );
      await User.findByIdAndUpdate(blockUserId, {
        $inc: { followersCount: 1 },
      }).session(session);
    }

    if (blockedUserExists.sendRequest) {
      // Restore sent follow request
      await FollowRequest.create(
        [
          {
            user: userId,
            requestUser: blockUserId,
          },
        ],
        {
          session,
        }
      );
      await User.findByIdAndUpdate(userId, {
        $inc: { requestsCount: 1 },
      }).session(session);
    }

    if (blockedUserExists.reveivedRequest) {
      // Restore received follow request
      await FollowRequest.create(
        [
          {
            user: blockUserId,
            requestUser: userId,
          },
        ],
        {
          session,
        }
      );
      await User.findByIdAndUpdate(blockUserId, {
        $inc: { requestsCount: 1 },
      }).session(session);
    }

    await session.commitTransaction();

    return responseHelper.success(
      res,
      true,
      "User unblocked successfully",
      200
    );
  } catch (error) {
    console.log(error);
    return responseHelper.error(res, error, "Error unblocking user", 500);
  } finally {
    await session.endSession();
  }
};
exports.updateFcmToken = async (req, res) => {
  try {
    const { userId } = req.user;
    const { fcmToken } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return responseHelper.error(res, null, "User not found", 400);
    }
    const updateFcmToken = await User.findByIdAndUpdate(userId, {
      fcmToken: fcmToken,
    });
    if (!updateFcmToken) {
      return responseHelper.error(res, null, "User not found", 400);
    }
    return responseHelper.success(res, updateFcmToken, "Fcm token updated", 200);
  } catch (error) {
    return responseHelper.error(res, error, "Error updating fcm token", 500);
  }
};