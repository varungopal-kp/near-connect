const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");
const { default: multerInstance, resizePhoto, multerVideoInstance } = require("../helpers/fileUpload");
const validator = require("../middlewares/validator");
const { postSchema } = require("../validations/postSchema");

const fileUploader = multerInstance("photos");
const fileUploaderVideo = multerVideoInstance("videos");

router.post(
  "/",
  fileUploader.single("file"),
  validator(postSchema),
  postController.createPost
);
router.get("/", postController.getAllPosts);
router.get("/list", postController.list);
router.get("/photos", postController.getPhotos);
router.post("/like", postController.postIteration);
router.post(
  "/photos",
  fileUploader.single('photo'),
  resizePhoto({
    resize: {
      width: 800,
      height: 800
    },
  }),
  postController.uploadPhoto
);
router.get("/videos", postController.getVideos);
router.post(
  "/videos",
  fileUploaderVideo.single('video'),
  postController.uploadVideo
);
router.delete("/photos/:id", postController.deletePhoto);
router.delete("/videos/:id", postController.deleteVideo);
router.get("/:id", postController.getPostById);
router.put("/:id", postController.updatePost);
router.delete("/:id", postController.deletePost);

module.exports = router;
