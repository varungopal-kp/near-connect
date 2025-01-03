const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const {
  default: multerInstance,
  resizePhoto,
} = require("../helpers/fileUpload");

const fileUploader = multerInstance("profile");

router.post("/", userController.createUser);
router.get("/", userController.getAllUsers);
router.get("/search", userController.searchUsers);
router.get("/profile", userController.getUserProfile);
router.put("/profile", userController.updateProfile);
router.get("/nearby", userController.getNearbyUsers);
router.put(
  "/profile/image",
  fileUploader.single("photo"),
  resizePhoto({
    resize: {
      width: 800,
      height: 800,
    },
  }),
  userController.updateProfileImage
);
router.post("/block", userController.blockUser);
router.post("/unblock", userController.unblockUser);
router.put("/fcm-token", userController.updateFcmToken);

router.get("/:id", userController.getUserById);
router.put("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);

module.exports = router;
