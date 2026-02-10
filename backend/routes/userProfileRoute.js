import express from "express";
import authUser from "../middleware/auth.js";
import {
  getProfile,
  updateProfile,
  changePassword,
  updateProfileImage,
} from "../controllers/userProfileController.js";
import profileUpload from "../middleware/profileUpload.js";

const router = express.Router();

router.post("/profile", authUser, getProfile);
router.put("/profile/update", authUser, updateProfile);
router.post("/profile/image", authUser, profileUpload.single("image"), updateProfileImage);
router.put("/profile/password", authUser, changePassword);

export default router;
