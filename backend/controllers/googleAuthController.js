import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import axios from "axios";

export const googleAuth = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.json({ success: false, message: "No token provided" });
    }

    // Verify Google token
    const googleUser = await axios.get(
      `https://www.googleapis.com/oauth2/v3/userinfo`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const { email, name, sub } = googleUser.data;

    // Check if user already exists
    let user = await userModel.findOne({ email });

    if (!user) {
      user = await userModel.create({
        name,
        email,
        password: `google-${sub}`, 
      });
    }

    // Create JWT
    const jwtToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      token: jwtToken,
    });

  } catch (error) {
    console.error(error);
    res.json({
      success: false,
      message: "Google authentication failed",
    });
  }
};
