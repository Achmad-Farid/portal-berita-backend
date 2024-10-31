const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const mongoose = require("mongoose");
const User = require("../models/userModel");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");

passport.use(
  new LocalStrategy({ usernameField: "identifier", passwordField: "password" }, async (identifier, password, done) => {
    try {
      // Cari pengguna dengan email atau username
      const user = await User.findOne({
        $or: [{ email: identifier }, { username: identifier }],
      });

      if (!user) {
        return done(null, false, { message: "Email atau Username tidak ditemukan" });
      }

      // Cek apakah pengguna menggunakan Google sebagai provider
      if (user.authProvider === "google") {
        return done(null, false, { message: "wrong auth provider" });
      }

      // Periksa kecocokan password
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return done(null, false, { message: "Password salah" });
      }

      // Jika berhasil, kembalikan user
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

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

passport.serializeUser((user, done) => {
  done(null, user._id); // Simpan ID pengguna ke dalam sesi
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user); // Mengambil pengguna dari database berdasarkan ID
  } catch (err) {
    done(err);
  }
});

module.exports = passport;
