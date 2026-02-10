import userModel from "../models/userModel.js";
import bcrypt from "bcryptjs";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs/promises";

/* ================= GET PROFILE ================= */
export const getProfile = async (req, res) => {
  try {
    const user = await userModel.findById(req.body.userId).select("-password");

    res.json({ success: true, user });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

/* ================= UPDATE PROFILE ================= */
export const updateProfile = async (req, res) => {
  try {
    const { name, phone, address, email } = req.body;
    const updateData = {};

    if (typeof name !== "undefined") updateData.name = name;
    if (typeof phone !== "undefined") updateData.phone = phone;
    if (typeof address !== "undefined") updateData.address = address;
    if (typeof email !== "undefined") updateData.email = email;

    const user = await userModel.findByIdAndUpdate(
      req.body.userId,
      updateData,
      { new: true }
    ).select("-password");

    res.json({ success: true, message: "Profile updated successfully", user });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const updateProfileImage = async (req, res) => {
  try {
    if (!req.file?.path) {
      return res.json({ success: false, message: "No image uploaded" });
    }

    const uploadResult = await cloudinary.uploader.upload(req.file.path, {
      folder: "profile",
      resource_type: "image",
    });

    const user = await userModel.findByIdAndUpdate(
      req.body.userId,
      { avatar: uploadResult.secure_url },
      { new: true }
    ).select("-password");

    await fs.unlink(req.file.path);

    res.json({ success: true, message: "Profile image updated", user });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

/* ================= CHANGE PASSWORD ================= */
export const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const user = await userModel.findById(req.body.userId);

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Old password incorrect" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
