const express = require("express");
const router = express.Router();
const commentController = require("../controllers/commentController");
const validator = require("../middlewares/validator");
const { commentSchema, replySchema } = require("../validations/postSchema");

router.get("/:postId", commentController.getAllComments);
router.delete("/:id", commentController.deleteComment);

router.post("/", validator(commentSchema), commentController.createComment);

router.post("/reply", validator(replySchema), commentController.createReply);

router.get("/replies/:commentId", commentController.getReplies);
router.delete("/reply/:id", commentController.deleteReply);


module.exports = router;
