const Notification = require("../models/notification");
const User = require("../models/user");
const admin = require("../config/firebase");

const sendNotification = async ({ userIds, type, data }) => {
 
  try {
    let message = "";
    let title = "";
    let pic = "";

    if (type === "postInteractions") {
      message = `${data.interactedUser.name} ${
        data.like ? "liked" : "disliked"
      } your post.`;
      title = "Post Interaction";
      pic = data.interactedUser.pic;
    }

    const users = await User.find({ _id: { $in: userIds } }).select([
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
      pic:pic
    }));

    // Save all the notification to the database
    await Notification.insertMany(notifications);

    // Send notification via FCM
    await sendPushNotificationToDevice(users, message, title);

    console.log("Notification sent successfully!");
  } catch (error) {
    console.error("Error sending notification:", error);
  }
};

const sendPushNotificationToDevice = async (users, message, title) => {
  try {
    const fcmToken = users.map((user) => user.fcmToken);

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
