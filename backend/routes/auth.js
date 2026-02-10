import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";

const authRouter = express.Router();


authRouter.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);


authRouter.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${process.env.CLIENT_URL}/login`,
  }),
  (req, res) => {
    const token = jwt.sign(
      { id: req.user._id, role: req.user.role || "user" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.redirect(`${process.env.CLIENT_URL}?token=${token}`);
  }
);

export default authRouter;
