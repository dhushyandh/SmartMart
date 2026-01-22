import crypto from "crypto";
import bcrypt from "bcryptjs";
import userModel from "../models/userModel.js";
import sendEmail from "../utils/sendEmail.js";


export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await userModel.findOne({ email });

    // ❌ EMAIL NOT FOUND → ERROR
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Email is not registered",
      });
    }

    // ✅ EMAIL FOUND → GENERATE TOKEN
    const resetToken = crypto.randomBytes(32).toString("hex");

    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 mins

    await user.save({ validateBeforeSave: false });

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    const message = `
Hello ${user.name},

You requested a password reset for your SmartMart account.

Click the link below to reset your password:
${resetUrl}

This link will expire in 15 minutes.

If you did not request this, please ignore this email.

— SmartMart Team
`;

    // 📧 SEND EMAIL (RESEND → GMAIL)
    await sendEmail({
      to: user.email,
      subject: "SmartMart Password Reset",
      text: message,
    });

    return res.json({
      success: true,
      message: "Password reset email sent. Please check your inbox.",
    });

  } catch (error) {
    console.error("Forgot password error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to send reset email. Try again later.",
    });
  }
};


export const resetPassword = async (req, res) => {
  try {
    const { password } = req.body;

    const hashedToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await userModel.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Reset link is invalid or expired",
      });
    }

    user.password = await bcrypt.hash(password, 12);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    return res.json({
      success: true,
      message: "Password reset successful. Please login.",
    });

  } catch (error) {
    console.error("Reset password error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong. Try again.",
    });
  }
};
