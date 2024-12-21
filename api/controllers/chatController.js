const Chat = require("../models/chat");
const Friend = require("../models/friend");
const responseHelper = require("../helpers/responseHelper");
const { convertToObjectId } = require("../helpers/mongoUtils");

// Fetch chat history
exports.getChatHistory = async (req, res) => {
  try {
    const { userId } = req.user;
    const chats = await Friend.aggregate([
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
                    { $eq: ["$sender", "$$friendId"] }
                  ]
                }
              }
            },
            { $sort: { createdAt: -1 } } // Sort within the lookup
          ],
          as: "chats",
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
    ]);
    

    return responseHelper.success(
      res,
      chats,
      "Chat history fetched successfully",
      200
    );
  } catch (error) {
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
