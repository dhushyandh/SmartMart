import express from "express";
import authUser from "../middleware/auth.js";
import {
  getProfile,
  updateProfile,
  changePassword,
} from "../controllers/userProfileController.js";

const router = express.Router();

router.post("/profile", authUser, getProfile);
router.put("/profile/update", authUser, updateProfile);
router.put("/profile/password", authUser, changePassword);

export default router;
