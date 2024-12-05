const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboardController");

router.get("/counts", dashboardController.getUnseenCounts);

module.exports = router;
