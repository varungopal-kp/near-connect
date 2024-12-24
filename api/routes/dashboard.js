const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboardController");

router.get("/counts", dashboardController.getUnseenCounts);
router.get("/friends", dashboardController.getFriends);
router.get("/followers", dashboardController.getFollowers);

module.exports = router;
