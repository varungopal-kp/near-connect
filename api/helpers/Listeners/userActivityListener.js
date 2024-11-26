const EventEmitter = require("events");
const eventEmitter = new EventEmitter();

const User = require("../../models/user");

// Event Listener for User Activity
eventEmitter.on("userActivity", async (payload) => {
 
  try {
    console.log(
      `Processing interaction for User: ${payload.userId}, Activity: ${payload.activity}`
    );

    // Fetch the user and update the interactions array
    const user = await User.findById(payload.userId);
    if (user) {
      const data = {
        activity: payload.activity,
        createdAt: new Date(),
        associatedUser: payload.associatedUserId,
        post: payload.postId,
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
