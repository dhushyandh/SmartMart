import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import userModel from "../models/userModel.js";

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL,
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                let user = await userModel.findOne({
                    email: profile.emails[0].value,
                });

                if (!user) {
                    user = await userModel.create({
                        name: profile.displayName,
                        email: profile.emails[0].value,
                        password: Math.random().toString(36).slice(-8),
                        googleImage: profile.photos?.[0]?.value || "",
                    });
                } else if (!user.googleImage && profile.photos?.[0]?.value) {
                    user.googleImage = profile.photos[0].value;
                    await user.save();
                }

                return done(null, user);
            } catch (err) {
                return done(err, null);
            }
        }
    )
);

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));
