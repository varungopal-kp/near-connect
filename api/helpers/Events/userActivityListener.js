const EventEmitter = require("events");
const eventEmitter = new EventEmitter();

const User = require("../../models/user");

// Event Listener for User Activity
eventEmitter.on("userActivity", async (payload) => {
  try {
    let message = "";

    console.log(
      `Processing interaction for User: ${payload.userId}, Activity: ${payload.type}`
    );

    // Fetch the user and update the interactions array
    const user = await User.findById(payload.userId);

    if (payload.type === "postInteractions") {
      message = `${payload.like ? "Liked" : "Disliked"} Post posted by `;
    } else if (payload.type === "commented") {
      message = `Commented on Post posted by `;
    } else if (payload.type === "replied") {
      message = `Replied on comment posted by `;
    } else if (payload.type === "newFriend") {
      message = `New Friend Added`;
    } else if (payload.type === "newPost") {
      message = `New Post posted`;
    }

    if (user) {
      const data = {
        message: message,
        activity: payload.type,
        associatedUser: payload.data.associatedUserId,
      };

      if (!user.recentActivity) {
        user.recentActivity = [];
      }

      user.recentActivity.unshift(data);

      // Keep only the latest 5 interactions
      user.recentActivity = user.recentActivity.slice(0, 5);

      // Save the updated user document
      await user.save();
    } else {
      console.error(`User not found: ${payload.userId}`);
    }
  } catch (error) {
    console.error("Error updating user interactions:", error);
  }
});

module.exports = eventEmitter;
