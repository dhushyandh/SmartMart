import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";

const authRouter = express.Router();

// STEP 1: Google Login
authRouter.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// STEP 2: Google Callback
authRouter.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${process.env.CLIENT_URL}/login`,
  }),
  (req, res) => {
    const token = jwt.sign(
      { id: req.user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.redirect(`http://localhost:5173?token=${token}` || `${frontendURL}?token=${token}`);
  }
);

export default authRouter;
