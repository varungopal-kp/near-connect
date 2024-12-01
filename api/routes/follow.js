const router = require("express").Router();
const followController = require("../controllers/followController");

router.get("/followers", followController.getFollowers);
router.get("/friends", followController.getFriends);
router.get("/follow-requests", followController.getFollowRequests);
router.post("/add-friend/:id", followController.addFriend);
router.delete("/remove-follower/:id", followController.removeFollower);
// router.post("/send-follower-request", followController.sendFollowerRequest);
// router.post("/unfollow", followController.unfollow);
// router.post("/unfriend", followController.unfriend);

module.exports = router;