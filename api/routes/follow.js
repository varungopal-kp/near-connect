const router = require("express").Router();
const followController = require("../controllers/followController");

router.get("/followers", followController.getFollowers);
router.get("/friends", followController.getFriends);
router.get("/follow-requests", followController.getFollowRequests);
router.post("/confirm-friend/:id", followController.confirmFriend);
router.delete("/remove-follower/:id", followController.removeFollower);
router.post("/delete-request/:id", followController.deleteFollowRequest);
router.post("/add-request/:id", followController.addFollowRequest);
router.post("/confirm-request/:id", followController.confirmFollowRequest);
router.get("/counts", followController.getCounts);
router.delete("/remove-friend/:id", followController.removeFriend);

router.get("/:username", followController.getFollowUserDetails);

module.exports = router;