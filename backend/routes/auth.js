import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';

const authRouter = express.Router();

authRouter.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// This handles the return from Google
authRouter.get(
  "/google/callback", 
  passport.authenticate("google", { session: false, failureRedirect: `${process.env.CLIENT_URL}/login` }),
  (req, res) => {
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET);

    // Use CLIENT_URL from your .env (e.g., https://smartmart-murex.vercel.app)
    const frontendURL = process.env.CLIENT_URL || "http://localhost:5173";
    res.redirect(`http://localhost:5173?token=${token}` || `${frontendURL}?token=${token}`); 
  }
);

export default authRouter;