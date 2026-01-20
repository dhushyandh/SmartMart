import crypto from "crypto";
import bcrypt from "bcryptjs";
import userModel from "../models/userModel.js";
import sendEmail from "../utils/sendEmail.js";

/* ===========================
   FORGOT PASSWORD
=========================== */
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    // Generate token
    const resetToken = crypto.randomBytes(20).toString("hex");

    // Hash token
    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 minutes

    await user.save({ validateBeforeSave: false });

    // Frontend reset URL
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    const message = `
You requested a password reset.

Click the link below to reset your password:
${resetUrl}

This link will expire in 15 minutes.
`;

    await sendEmail({
      email: user.email,
      subject: "SmartMart Password Reset",
      message,
    });

    res.json({
      success: true,
      message: "Password reset email sent",
    });

  } catch (error) {
    console.error(error);
    res.json({
      success: false,
      message: "Email could not be sent",
    });
  }
};

/* ===========================
   RESET PASSWORD
=========================== */
export const resetPassword = async (req, res) => {
  try {
    // Hash token from URL
    const resetToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await userModel.findOne({
      resetPasswordToken: resetToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.json({
        success: false,
        message: "Reset token invalid or expired",
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.json({
      success: true,
      message: "Password reset successful",
    });

  } catch (error) {
    console.error(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};
