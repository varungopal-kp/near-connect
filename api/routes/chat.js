const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chatController");

router.get("/", chatController.getChatHistory);
router.get("/messages/:user", chatController.getChatMessages);

module.exports = router;
