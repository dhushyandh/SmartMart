import mongoose from "mongoose";
import crypto from "crypto";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    role: {
      type: String,
      default: "user",
    },

    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      default: "",
    },
    avatar: {
      type: String,
      default: "",
    },
    googleImage: {
      type: String,
      default: "",
    },

    address: {
      type: String,
      default: "",
    },
    cartData: {
      type: Object,
      default: {},
    },

    // 🔐 FORGOT PASSWORD FIELDS
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  { minimize: false, timestamps: true }
);

// 🔑 Generate reset password token
userSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");

  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 minutes

  return resetToken;
};

const userModel =
  mongoose.models.user || mongoose.model("user", userSchema);

export default userModel;
