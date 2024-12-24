const Notification = require("../models/notification");
const User = require("../models/user");
const Follower = require("../models/follower");
const Friend = require("../models/friend");
const admin = require("../config/firebase");

const sendNotification = async ({
  userId,
  message,
  title,
  pic,
  ff,
  data = {},
}) => {
  try {
    console.log("Sending notification to:", userId);

    let userIDs = [];

    let image = pic;

    if (!image) {
      image = `images/logo.jpg`;
    }

    if (!message) {
      console.log("No message provided.");
      return;
    }

    if (!title) {
      title = "Near Connect";
    }

    if (!userId) {
      console.log("No user IDs provided.");
      return;
    }

    if (Array.isArray(userId)) {
      userIDs = userId;
    } else {
      userIDs = [userId];
    }

    if (ff) {
      let user = await User.findOne({ _id: userId }).select(["_id"]);
      let followers = await Follower.find({ user: user._id }).select([
        "follower",
      ]);
      let friends = await Friend.find({ user: user._id }).select(["friend"]);
      userIDs = [
        ...followers.map((follower) => follower.follower),
        ...friends.map((friend) => friend.friend),
      ].filter(Boolean);
    }

    console.log("User IDs:", userIDs);

    const users = await User.find({ _id: { $in: userIDs } }).select([
      "_id",
      "name",
      "fcmToken",
    ]);

    if (users.length === 0) {
      console.log("No users found for the provided IDs.");
      return;
    }

    const notifications = users.map((user) => ({
      user: user._id,
      message: message,
      title: title,
      pic: image,
    }));

    // Save all the notification to the database
    await Notification.insertMany(notifications);

    // Send notification via FCM
    await sendPushNotificationToDevice(users, message, title, data);

    console.log("Notification sent successfully!");
  } catch (error) {
    console.error("Error sending notification:", error);
  }
};

const sendPushNotificationToDevice = async (users, message, title, data) => {
  try {
    const fcmToken = users.map((user) => user.fcmToken);

    console.log("FCM tokens:", fcmToken);

    if (!fcmToken) {
      console.error("No FCM token found for user");
      return;
    }

    // Send notification via FCM
    let payload = {
      tokens: fcmToken,
      notification: {
        title: title,
        body: message,
      },
      data: data,
    };

    console.log("Push notification sent to FCM successfully!");

    return await admin.messaging().sendEachForMulticast(payload);
  } catch (error) {
    console.error("Error sending push notification via FCM:", error);
  }
};

module.exports = {
  sendNotification,
};
