const Comment = require("../models/comment");
const responseHelper = require("../helpers/responseHelper");
const Reply = require("../models/reply");
const { convertToObjectId } = require("../helpers/mongoUtils");
const mongoose = require("mongoose");
const Post = require("../models/post");
const userActivityListener = require("../helpers/Events/userActivityListener");

exports.createComment = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    const data = req.body;
    data.user = req.user.userId;

    session.startTransaction();

    const comment = new Comment(data);
    await comment.save({ session });

    const post = await Post.findByIdAndUpdate(data.post, {
      $inc: { comments: 1 },
    }).session(session);

    await session.commitTransaction();

    await comment.populate("user");

    userActivityListener.emit("userActivity", {
      userId: req.user.userId,
      type: "comment",
      data: {
        associatedUserId: post.user,
      },
    });

    return responseHelper.success(
      res,
      comment,
      "Comment created successfully",
      201
    );
  } catch (error) {
    console.log(error);
    await session.abortTransaction();
    return responseHelper.error(res, error, "Error creating comment", 500);
  } finally {
    await session.endSession();
  }
};

exports.getAllComments = async (req, res) => {
  try {
    const { postId } = req.params;

    const page = +req.query.page || 1;
    const limit = +req.query.limit || 5;

    const skip = (page - 1) * limit;

    const replyLimit = 5;

    const comments = await Comment.aggregate([
      { $match: { post: convertToObjectId(postId) } },
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
      {
        $lookup: {
          from: "posts",
          localField: "post",
          foreignField: "_id",
          as: "post",
        },
      },
      { $unwind: "$post" },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $lookup: {
          from: "replies",
          localField: "_id",
          foreignField: "comment",
          as: "replies",

          pipeline: [
            {
              $addFields: {
                canModify: {
                  $eq: ["$user", convertToObjectId(req.user.userId)],
                },
              },
            },
            {
              $limit: replyLimit,
            },
          ],
        },
      },
      {
        $addFields: {
          canModify: { $eq: ["$user._id", convertToObjectId(req.user.userId)] },
        },
      },
    ]);

    const totalItems = await Comment.countDocuments({ post: postId });
    const totalPages = Math.ceil(totalItems / limit);
    const hasMore = skip + limit < totalItems;

    return responseHelper.success(
      res,
      { comments, totalPages, hasMore },
      "Success",
      200
    );
  } catch (error) {
    console.log(error);
    return responseHelper.error(res, error, "Error fetching comments", 500);
  }
};

exports.createReply = async (req, res) => {
  try {
    const data = req.body;
    data.user = req.user.userId;

    const reply = new Reply(data);
    await reply.save();

    const comment = await Comment.findById(data.comment).select("user");

    userActivityListener.emit("userActivity", {
      userId: req.user.userId,
      type: "replied",
      data: {
        associatedUserId: comment.user,
      },
    });

    return responseHelper.success(
      res,
      reply,
      "Reply created successfully",
      201
    );
  } catch (error) {
    return responseHelper.error(res, error, "Error creating reply", 500);
  }
};

exports.getReplies = async (req, res) => {
  try {
    const { commentId } = req.params;

    const page = +req.query.page || 1;
    const limit = +req.query.limit || 3;
    const skip = (page - 1) * limit;

    const replies = await Reply.aggregate([
      { $match: { comment: convertToObjectId(commentId) } },
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $addFields: {
          canModify: {
            $eq: ["$user._id", convertToObjectId(req.user.userId)],
          },
        },
      },
    ]);

    const totalItems = await Reply.countDocuments({ comment: commentId });
    const totalPages = Math.ceil(totalItems / limit);
    const hasMore = skip + limit < totalItems;
    return responseHelper.success(
      res,
      { replies, totalPages, hasMore },
      "Success",
      200
    );
  } catch (error) {
    return responseHelper.error(res, error, "Error fetching replies", 500);
  }
};

exports.deleteComment = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const deletedComment = await Comment.findByIdAndDelete(
      req.params.id
    ).session(session);
    if (!deletedComment) {
      return responseHelper.error(res, null, "Comment not found", 400);
    }
    await Post.findByIdAndUpdate(deletedComment.post, {
      $inc: { comments: -1 },
    }).session(session);

    await session.commitTransaction();
    return responseHelper.success(
      res,
      true,
      "Comment deleted successfully",
      200
    );
  } catch (error) {
    await session.abortTransaction();
    return responseHelper.error(res, error, "Error deleting comment", 500);
  } finally {
    await session.endSession();
  }
};

exports.deleteReply = async (req, res) => {
  try {
    const deletedReply = await Reply.findByIdAndDelete(req.params.id);
    if (!deletedReply) {
      return responseHelper.error(res, null, "Reply not found", 400);
    }
    return responseHelper.success(res, true, "Reply deleted successfully", 200);
  } catch (error) {
    return responseHelper.error(res, error, "Error deleting reply", 500);
  }
};
