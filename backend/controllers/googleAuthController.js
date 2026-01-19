import axios from "axios";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

export const googleRedirect = (req, res) => {
  const url =
    "https://accounts.google.com/o/oauth2/v2/auth?" +
    new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI,
      response_type: "code",
      scope: "openid email profile",
    });

  res.redirect(url);
};

export const googleCallback = async (req, res) => {
  try {
    const { code } = req.query;

    // Exchange code → tokens
    const tokenRes = await axios.post(
      "https://oauth2.googleapis.com/token",
      {
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        code,
        redirect_uri: process.env.GOOGLE_REDIRECT_URI,
        grant_type: "authorization_code",
      }
    );

    const { access_token } = tokenRes.data;

    // Get user info
    const userRes = await axios.get(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: { Authorization: `Bearer ${access_token}` },
      }
    );

    const { email, name } = userRes.data;

    let user = await userModel.findOne({ email });
    if (!user) {
      user = await userModel.create({
        name,
        email,
        password: "google-oauth",
      });
    }

    const jwtToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Redirect back to frontend with token
    res.redirect(
      `https://smartmart-murex.vercel.app/google-success?token=${jwtToken}`
    );
  } catch (err) {
    console.error(err);
    res.redirect("https://smartmart-murex.vercel.app/login");
  }
};
