const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");
const multerInstance = require("../helpers/fileUpload");
const validator = require("../middlewares/validator");
const { postSchema } = require("../validations/postSchema");

const fileUploader = multerInstance("posts");

router.post(
  "/",
  fileUploader.single("file"),
  validator(postSchema),
  postController.createPost
);
router.get("/", postController.getAllPosts);
router.get("/list", postController.list);
router.get("/:id", postController.getPostById);
router.put("/:id", postController.updatePost);
router.delete("/:id", postController.deletePost);

router.post("/like", postController.postIteration);

module.exports = router;
