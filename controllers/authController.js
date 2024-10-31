require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/userModel.js");
const bcrypt = require("bcrypt");
const passport = require("passport");
const frontend = process.env.FRONTEND;

// fungsi register
exports.signup = async (req, res) => {
  const { email, username, password } = req.body;

  try {
    // Check if the email is in use
    const existingEmail = await User.findOne({ email }).exec();
    if (existingEmail) {
      return res.status(409).send({
        message: "Email is already in use.",
      });
    }
    // Periksa apakah nama pengguna sudah ada di database
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // Hash password menggunakan bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    // Step 1 - Create and save the user
    const user = new User({
      _id: new mongoose.Types.ObjectId(),
      email: email,
      username: username,
      password: hashedPassword,
      authProvider: "email",
    });

    await user.save();

    return res.status(201).send({
      message: `Pendaftaran ${email} Berhasil`,
    });
  } catch (err) {
    return res.status(500).send(err);
  }
};

// fungsi login
exports.login = async (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return res.status(500).json({ success: false, message: "Internal Server Error", error: err });
    }
    if (!user) {
      return res.status(401).json({ success: false, message: info.message });
    }
    req.logIn(user, (err) => {
      if (err) {
        return res.status(500).json({ success: false, message: "Login failed", error: err });
      }
      // Jika berhasil login
      return res.status(200).json({ success: true, message: "Login berhasil", user });
    });
  })(req, res, next);
};

exports.loginWithGoogle = passport.authenticate("google", { scope: ["profile", "email"] });

exports.googleCallback = (req, res, next) => {
  passport.authenticate("google", (err, user, info) => {
    if (err) {
      return res.status(500).json({ success: false, message: "Server error", error: err });
    }
    if (!user) {
      return res.status(401).json({ success: false, message: "Login failed or user not found" });
    }
    req.logIn(user, (err) => {
      if (err) {
        return res.status(500).json({ success: false, message: "Login failed", error: err });
      }

      // Redirect to the frontend after successful login
      return res.redirect(`${frontend}`);
    });
  })(req, res, next);
};

exports.logout = (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ success: false, message: "Logout failed", error: err });
    }
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ success: false, message: "Error destroying session", error: err });
      }
      res.status(200).json({ success: true, message: "Logout successful" });
    });
  });
};
