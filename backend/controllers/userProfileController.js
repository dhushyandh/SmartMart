import userModel from "../models/userModel.js";
import bcrypt from "bcryptjs";

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
    const { name, phone, address } = req.body;

    await userModel.findByIdAndUpdate(req.body.userId, {
      name,
      phone,
      address,
    });

    res.json({ success: true, message: "Profile updated successfully" });
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
