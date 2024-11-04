const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const mongoose = require("mongoose");
const User = require("../models/userModel");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const existingUser = await User.findOne({ email: profile.emails[0].value });

        if (existingUser) {
          // Jika pengguna sudah ada, login saja
          return done(null, existingUser);
        }

        // Jika belum ada, buat pengguna baru
        const newUser = new User({
          _id: new mongoose.Types.ObjectId(),
          email: profile.emails[0].value,
          username: profile.displayName,
          profilePicture: profile.photos[0].value,
          authProvider: "google",
        });

        await newUser.save();
        done(null, newUser);
      } catch (error) {
        done(error, null);
      }
    }
  )
);

module.exports = passport;
