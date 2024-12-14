const User = require("../models/user");
const responseHelper = require("../helpers/responseHelper");
const { convertToObjectId } = require("../helpers/mongoUtils");
const { geocode } = require("../helpers/geoCodeHelper");

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
  
    const user = await User.aggregate([
      {
        $match: {
          _id: convertToObjectId(req.user.userId),
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
          from: "followers", // Collection name for followers
          let: { userId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$user", convertToObjectId(userId)] },
                    { $eq: ["$follower", "$$userId"] },
                  ],
                },
              },
            },
          ],
          as: "followerRelation",
        },
      },
      {
        $lookup: {
          from: "friends", // Collection name for friends
          let: { userId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$user", convertToObjectId(userId)] },
                    { $eq: ["$friend", "$$userId"] },
                  ],
                },
              },
            },
          ],
          as: "friendRelation",
        },
      },
      {
        $lookup: {
          from: "followrequests", // Collection name for requests
          let: { userId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$user", convertToObjectId(userId)] },
                    { $eq: ["$requestUser", "$$userId"] },
                  ],
                },
              },
            },
          ],
          as: "requestRelation",
        },
      },
      {
        $addFields: {
          userRelation: {
            $cond: [
              { $gt: [{ $size: "$friendRelation" }, 0] },
              "friend",
              {
                $cond: [
                  { $gt: [{ $size: "$followerRelation" }, 0] },
                  "follower",
                  {
                    $cond: [
                      { $gt: [{ $size: "$requestRelation" }, 0] },
                      "requestUser",
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
        $project: {
          friendRelation: 0,
          followerRelation: 0,
          requestRelation: 0,
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
