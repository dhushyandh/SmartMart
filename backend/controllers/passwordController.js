import crypto from "crypto";
import bcrypt from "bcryptjs";
import userModel from "../models/userModel.js";
import sendEmail from "../utils/sendEmail.js";

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  // 🔐 Always same response (security)
  const safeResponse = {
    success: true,
    message:
      "If this email exists, a password reset link has been sent. Please check your inbox or spam.",
  };

  try {
    const user = await userModel.findOne({ email });

    // If user does NOT exist → return safely
    if (!user) {
      console.log("🔍 Reset requested for non-existing email:", email);
      return res.json(safeResponse);
    }

    // 1️⃣ Generate secure token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // 2️⃣ Hash token before saving
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // 3️⃣ Save token + expiry
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 min

    await user.save({ validateBeforeSave: false });

    // 4️⃣ Build reset URL
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    // 5️⃣ Email content
    const message = `
Hello ${user.name},

You requested a password reset for your SmartMart account.

Reset your password using the link below:
${resetUrl}

This link will expire in 15 minutes.

If you didn’t request this, please ignore this email.

— SmartMart Security Team
`;

    // 6️⃣ Send email ASYNC (non-blocking)
    sendEmail({
      to: user.email,
      subject: "SmartMart – Password Reset Request",
      text: message,
    });

    console.log("✅ Password reset initiated for:", user.email);

    return res.json(safeResponse);

  } catch (error) {
    console.error("❌ Forgot password error:", error);
    return res.json(safeResponse); 
  }
};


export const resetPassword = async (req, res) => {
  try {
    const { password } = req.body;

    // 1️⃣ Hash token from URL
    const hashedToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    // 2️⃣ Find valid token
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

    // 3️⃣ Hash new password
    const hashedPassword = await bcrypt.hash(password, 12);

    // 4️⃣ Update password + clear reset fields
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    console.log("🔐 Password reset successful for:", user.email);

    res.json({
      success: true,
      message: "Password reset successful. Please login again.",
    });

  } catch (error) {
    console.error("❌ Reset password error:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again.",
    });
  }
};
