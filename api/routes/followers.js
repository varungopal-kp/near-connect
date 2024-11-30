const router = require("express").Router();
const followerController = require("../controllers/followerController");

router.get("/followers", followerController.getFollowers);
router.get("/friends", followerController.getFriends);
router.get("/follower-requests", followerController.getFriendRequests);
// router.post("/accept-follower", followerController.acceptFollower);
// router.post("/reject-follower", followerController.rejectFollower);
// router.post("/send-follower-request", followerController.sendFollowerRequest);
// router.post("/unfollow", followerController.unfollow);
// router.post("/unfriend", followerController.unfriend);

module.exports = router;