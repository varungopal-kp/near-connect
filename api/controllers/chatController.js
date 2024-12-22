const Chat = require("../models/chat");
const Friend = require("../models/friend");
const responseHelper = require("../helpers/responseHelper");
const { convertToObjectId } = require("../helpers/mongoUtils");

exports.getChatMessages = async (req, res) => {
  try {
    const { userId } = req.user;
    const { user } = req.params;
    const page = +req.query.page || 1;
    const limit = +req.query.limit || 10;

    const skip = (page - 1) * limit;

    const filter = {
      $or: [
        {
          sender: convertToObjectId(userId),
          receiver: convertToObjectId(user),
        },
        {
          sender: convertToObjectId(user),
          receiver: convertToObjectId(userId),
        },
      ],
    };

    const list = await Chat.aggregate([
      { $match: filter }, // Apply the filter
      {
        $addFields: {
          by: {
            $cond: {
              if: { $eq: ["$sender", convertToObjectId(userId)] }, // Check if the sender is the current user
              then: "me", // If true, set "me"
              else: "you", // Otherwise, set "you"
            },
          },
        },
      },
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
    ]);

    const totalItems = await Chat.countDocuments(filter);
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
    return responseHelper.error(res, null, error.message, 400);
  }
};

// Fetch chat history
exports.getChatHistory = async (req, res) => {
  try {
    const { userId } = req.user;
    const page = +req.query.page || 1;
    const limit = +req.query.limit || 20;

    const skip = (page - 1) * limit;

    const chats = [
      {
        $lookup: {
          from: "chats",
          let: { friendId: "$friend" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $or: [
                    { $eq: ["$receiver", "$$friendId"] },
                    { $eq: ["$sender", "$$friendId"] },
                  ],
                },
              },
            },
            { $sort: { createdAt: -1 } },
            { $limit: 1 },
          ],
          as: "chats",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "friend",
          foreignField: "_id",
          as: "friend",
          pipeline: [
            {
              $project: {
                _id: 1,
                name: 1,
                username: 1,
                pic: 1,
              },
            },
          ],
        },
      },
      {
        $unwind: {
          path: "$friend",
        },
      },
      {
        $match: {
          user: convertToObjectId(userId),
        },
      },
      {
        $sort: {
          "chats.createdAt": -1,
        },
      },
    ];

    const list = await Friend.aggregate([
      ...chats,
      { $skip: skip },
      { $limit: limit },
    ]);

    let totalItems = await Friend.aggregate([
      ...chats,
      { $count: "totalItems" },
    ]);
    totalItems = totalItems.length > 0 ? totalItems[0].totalItems : 0;

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
    return responseHelper.error(res, error, "Error fetching chat history", 500);
  }
};

// Save a new chat
exports.saveMessage = async (data) => {
  try {
    const chat = new Chat(data);
    await chat.save();
    return chat;
  } catch (err) {
    return err;
  }
};
