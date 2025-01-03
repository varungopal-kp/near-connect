const Post = require("../models/post");
const Photo = require("../models/photo");
const Video = require("../models/video");
const User = require("../models/user");
const mongoose = require("mongoose");
const PostInteraction = require("../models/postInteraction");
const { convertToObjectId } = require("../helpers/mongoUtils");
const userActivityListener = require("../helpers/Events/userActivityListener");
const { sendNotification } = require("../helpers/notificationHelper");
const responseHelper = require("../helpers/responseHelper");
const { replaceFileUrl } = require("../helpers/utility");
const { postSchema } = require("../validations/postSchema");
const { generateThumbnail } = require("../helpers/fileUpload");

// create a new post
exports.createPost = async (req, res) => {
  try {
    const { userId } = req.user;
    const { content, fileType } = req.body;

    const data = {
      content,
      user: userId,
    };

    if (fileType && req.file) {
      data.fileType = fileType;
      data.file = replaceFileUrl(req.file.path);
    }

    const newPost = new Post(data);
    await newPost.save();
    await newPost.populate("user");

    userActivityListener.emit("userActivity", {
      userId: userId,
      type: "newPost",
    });

    sendNotification({
      userId: userId,
      ff: true,
      message: `${newPost.user.name} posted a new post`,
      title: "New Post",
    });

    return responseHelper.success(
      res,
      newPost,
      "Post created successfully",
      201
    );
  } catch (error) {
    console.log(error);
    return responseHelper.error(res, error, "Error creating post", 500);
  }
};

// get all posts of a user
exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find({ user: req.params.userId });
    return responseHelper.success(res, posts, "Success", 200);
  } catch (error) {
    return responseHelper.error(res, error, "Error fetching posts", 500);
  }
};

// get a single post
exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return responseHelper.error(res, null, "Post not found", 404);
    }
    return responseHelper.success(res, post, "Success", 200);
  } catch (error) {
    return responseHelper.error(res, error, "Error fetching post", 500);
  }
};
// update a post
exports.updatePost = async (req, res) => {
  try {
    const updatedPost = await Post.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedPost) {
      return responseHelper.validationError(res, errors, "Invalid input data");
    }
    return responseHelper.success(
      res,
      updatedPost,
      "Post updated successfully",
      200
    );
  } catch (error) {
    return responseHelper.error(res, error, "Error updating post", 500);
  }
};
// delete a post
exports.deletePost = async (req, res) => {
  try {
    const deletedPost = await Post.findByIdAndDelete(req.params.id);
    if (!deletedPost) {
      return responseHelper.error(res, null, "Post not found", 404);
    }
    return responseHelper.success(res, true, "Post deleted successfully", 200);
  } catch (error) {
    return responseHelper.error(res, error, "Error deleting post", 500);
  }
};

exports.postIteration = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    const { userId } = req.user;
    const { body } = req;

    const data = {
      user: userId,
      ...body,
    };

    session.startTransaction();

    const existingInteraction = await PostInteraction.findOne({
      user: userId,
      post: body.post,
    }).session(session);

    const postIteration = await PostInteraction.findOneAndUpdate(
      { user: userId, post: body.post },
      data,
      { upsert: true, new: true }
    )
      .populate("user", ["name", "pic"])
      .session(session);

    const postUpdates = { $inc: { likes: 0, dislikes: 0 } };

    if (!existingInteraction) {
      if (body.like) postUpdates.$inc.likes += 1;
      else if (body.dislike) postUpdates.$inc.dislikes += 1;
    } else {
      if (existingInteraction.like !== body.like) {
        postUpdates.$inc.likes += body.like ? 1 : -1;
      } else if (existingInteraction.dislike !== body.dislike) {
        postUpdates.$inc.dislikes += body.dislike ? 1 : -1;
      }
    }

    const post = await Post.findByIdAndUpdate(body.post, postUpdates).session(
      session
    );

    await session.commitTransaction();

    userActivityListener.emit("userActivity", {
      userId: userId,
      type: "postInteractions",
      data: {
        associatedUserId: post.user,
      },
    });

    if (userId !== post.user) {
      sendNotification({
        userId: post.user,
        message: `${postIteration.user.name} ${
          body.like ? "liked" : "disliked"
        } your post.`,
        title: "Post Interaction",
        pic: postIteration.user.pic,
      });
    }

    return responseHelper.success(res, postIteration, "Success", 200);
  } catch (error) {
    await session.abortTransaction();
    return responseHelper.error(res, error, "Error", 500);
  } finally {
    session.endSession();
  }
};

exports.list = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  let user = req.user.userId;
  if (req.query.user && req.query.user !== "false") user = req.query.user;

  try {
    const skip = (page - 1) * limit;

    let relatedUsers = [convertToObjectId(user)];

    if (!req.query.user) {
      const friendsAndFollowedUsers = await User.aggregate([
        {
          $match: { _id: convertToObjectId(user) }, // Match the current user
        },
        {
          $lookup: {
            from: "friends", // Assuming you have a "friends" collection
            localField: "_id",
            foreignField: "user",
            as: "friends",
          },
        },
        {
          $lookup: {
            from: "followers", // Assuming you have a "follows" collection
            localField: "_id",
            foreignField: "user",
            as: "followers",
          },
        },
        {
          $project: {
            friends: "$friends.friend", // Extract only the friend IDs
            followers: "$followers.follower", // Extract only the followed user IDs
          },
        },
        {
          $addFields: {
            relatedUsers: { $setUnion: [["$_id"], "$friends", "$followers"] }, // Combine user ID, friends, and followed users
          },
        },
        {
          $project: {
            relatedUsers: 1, // Return only the relatedUsers field
          },
        },
      ]);

      relatedUsers = friendsAndFollowedUsers[0]?.relatedUsers || [];
    }

    const list = await Post.aggregate([
      {
        $match: {
          user: { $in: relatedUsers }, // Match posts from the user, their friends, and followed users
        },
      },
      {
        $lookup: {
          from: "postinteractions", // Make sure this is the exact name of your PostInteraction collection in MongoDB
          localField: "_id",
          foreignField: "post",
          as: "postinteractions",
        },
      },
      {
        $lookup: {
          from: "users", // Make sure this is the exact name of your User collection in MongoDB
          localField: "user",
          foreignField: "_id",
          as: "user",
        },
      },

      {
        $unwind: "$user", // Unwind to transform user array into a single object
      },
      {
        $unwind: {
          path: "$postinteractions",
          preserveNullAndEmptyArrays: true, // To include posts with no postinteractions
        },
      },

      {
        $lookup: {
          from: "users",
          localField: "postinteractions.user",
          foreignField: "_id",
          as: "postinteractions.user",
          pipeline: [
            {
              $project: {
                _id: 1,
                name: 1,
                pic: 1,
              },
            },
          ],
        },
      },

      {
        $unwind: {
          path: "$postinteractions.user",
          preserveNullAndEmptyArrays: true, // To handle cases with missing interaction details
        },
      },

      {
        $group: {
          _id: "$_id",
          content: { $first: "$content" },
          file: { $first: "$file" },
          fileType: { $first: "$fileType" },
          likes: { $first: "$likes" },
          dislikes: { $first: "$dislikes" },
          comments: { $first: "$comments" },
          createdAt: { $first: "$createdAt" },
          updatedAt: { $first: "$updatedAt" },
          user: { $first: "$user" },
          postinteractions: { $push: "$postinteractions" }, // Group all postinteractions in an array
        },
      },
      // Filter out empty user objects in postinteractions
      {
        $addFields: {
          postinteractions: {
            $filter: {
              input: "$postinteractions",
              as: "interaction",
              cond: {
                $and: [
                  { $gt: [{ $type: "$$interaction.user" }, "missing"] }, // Keep only interactions with a non-missing user
                  {
                    $eq: [
                      "$$interaction.user._id",
                      convertToObjectId(req.user.userId), // Convert user to ObjectId
                    ],
                  }, // Match postinteractions.user._id with userId
                ],
              },
            },
          },
          canModify: {
            $eq: [
              "$user._id", // Compare post creator's user ID with user
              convertToObjectId(req.user.userId),
            ],
          },
        },
      },
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
    ]);

    const totalItems = await Post.countDocuments({
      user: { $in: relatedUsers },
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
      "Successfull",
      200
    );
  } catch (error) {
    console.log(error);
    return responseHelper.error(res, error, "Error", 500);
  }
};
exports.getPhotos = async (req, res) => {
  try {
    const { userId } = req.user;
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * limit;

    let user = userId;
    if (req.query.user) user = req.query.user;

    const list = await Photo.find({ user: user })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);

    const totalItems = await Photo.countDocuments({ user: user });
    const totalPages = Math.ceil(totalItems / limit);
    const hasMore = page < totalPages;

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
    return responseHelper.error(res, error, "Error", 500);
  }
};
exports.getVideos = async (req, res) => {
  try {
    const { userId } = req.user;
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * limit;

    let user = userId;
    if (req.query.user) user = req.query.user;

    const list = await Video.find({ user: user })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);

    const totalItems = await Video.countDocuments({ user: user });
    const totalPages = Math.ceil(totalItems / limit);
    const hasMore = page < totalPages;

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
    return responseHelper.error(res, error, "Error", 500);
  }
};

exports.uploadPhoto = async (req, res) => {
  try {
    const { userId } = req.user;

    const data = {
      user: userId,
    };

    if (!req.file) {
      return responseHelper.validationError(res, errors, "Invalid input data");
    }

    data.path = replaceFileUrl(req.file.resizedPath);
    data.mimeType = req.file.mimetype;
    data.fileSize = req.file.size;
    data.fileName = req.file.originalname;
    data.thumbnail = replaceFileUrl(req.file.thumbnailPath);
    const photo = new Photo(data);
    await photo.save();

    return responseHelper.success(res, photo, "Successfull", 200);
  } catch (error) {
    console.log(error);
    return responseHelper.error(res, error, "Error", 500);
  }
};
exports.uploadVideo = async (req, res) => {
  try {
    const { userId } = req.user;

    const data = {
      user: userId,
    };

    if (!req.file) {
      return responseHelper.validationError(res, errors, "Invalid input data");
    }

    data.path = replaceFileUrl(req.file.path);
    data.mimeType = req.file.mimetype;
    data.fileSize = req.file.size;
    data.fileName = req.file.originalname;

    const thumbPath = req.file.destination + "/thumbnail";

    const videoThumb = await generateThumbnail(req.file.path, thumbPath);

    if (!videoThumb) {
      return responseHelper.validationError(res, errors, "Invalid input data");
    }

    const thumbFullPath = thumbPath + "/" + videoThumb;

    data.thumbnail = replaceFileUrl(thumbFullPath);
    const video = new Video(data);
    await video.save();

    return responseHelper.success(res, video, "Successfull", 200);
  } catch (error) {
    console.log(error);
    return responseHelper.error(res, error, "Error", 500);
  }
};
exports.deletePhoto = async (req, res) => {
  try {
    const { id } = req.params;
    const photo = await Photo.findByIdAndDelete(id);
    return responseHelper.success(res, photo, "Successfull", 200);
  } catch (error) {
    console.log(error);
    return responseHelper.error(res, error, "Error", 500);
  }
};
exports.deleteVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const video = await Video.findByIdAndDelete(id);
    return responseHelper.success(res, video, "Successfull", 200);
  } catch (error) {
    console.log(error);
    return responseHelper.error(res, error, "Error", 500);
  }
};
