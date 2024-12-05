const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notificationController");

router.get("/", notificationController.getUserNotifications);
router.put("/", notificationController.updateSeenStatus);
router.delete("/:id", notificationController.deleteNotification);

module.exports = router;
