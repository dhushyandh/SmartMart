import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import userModel from "../models/userModel.js"; // Ensure the .js extension is here

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            // Dynamically set callback based on environment
            callbackURL: process.env.NODE_ENV === 'production'
                ? "https://shopxy-backend.vercel.app/auth/google/callback"
                : "http://localhost:4000/auth/google/callback",
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                let user = await userModel.findOne({ email: profile.emails[0].value });

                if (!user) {
                    user = await userModel.create({
                        name: profile.displayName,
                        email: profile.emails[0].value,
                        password: Math.random().toString(36).slice(-8),
                    });
                }
                return done(null, user);
            } catch (error) {
                return done(error, null);
            }
        }
    )
);

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));