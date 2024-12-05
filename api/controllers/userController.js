const User = require("../models/user");
const responseHelper = require("../helpers/responseHelper");
const { convertToObjectId } = require("../helpers/mongoUtils");

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
          email: { $first: "$email" },
          pic: { $first: "$pic" },
          recentActivity: { $push: "$recentActivity" },
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          email: 1,
          pic: 1,
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
