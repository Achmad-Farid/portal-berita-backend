require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/userModel.js");
const bcrypt = require("bcrypt");
const passport = require("passport");
const frontend = process.env.FRONTEND;
const jwt = require("jsonwebtoken");

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

// Fungsi Login dengan JWT
exports.login = async (req, res) => {
  const { identifier, password } = req.body; // Gunakan `identifier` untuk email atau username

  try {
    // Cari pengguna berdasarkan email atau username
    const user = await User.findOne({
      $or: [{ email: identifier }, { username: identifier }],
    }).exec();

    if (!user) {
      return res.status(401).json({ success: false, message: "User not found" });
    }

    if (user.authProvider === "google") {
      return res.status(401).json({ success: false, message: "Wrong auth provider" });
    }

    // Periksa kecocokan password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: "Invalid password" });
    }

    // Buat token JWT
    const token = jwt.sign({ id: user._id, email: user.email, username: user.username, profilePicture: user.profilePicture, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    return res.status(200).json({
      success: true,
      message: "Login berhasil",
      token,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Internal Server Error", error: err });
  }
};

// Endpoint untuk login dengan Google
exports.loginWithGoogle = passport.authenticate("google", { scope: ["profile", "email"] });

exports.googleCallback = (req, res, next) => {
  passport.authenticate("google", async (err, user) => {
    const frontend = process.env.FRONTEND || "http://localhost:3000"; // Definisikan URL frontend

    try {
      if (err) {
        console.error("Authentication Error:", err);
        return res.redirect(`${frontend}/error?message=${encodeURIComponent("Server error during login")}`);
      }
      if (!user) {
        console.warn("User not found or login failed");
        return res.redirect(`${frontend}/error?message=${encodeURIComponent("Login failed or user not found")}`);
      }

      // Buat token JWT
      const token = jwt.sign(
        { id: user._id, email: user.email, username: user.username, profilePicture: user.profilePicture, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "24h" } // Perpanjang waktu kadaluarsa
      );

      // Redirect ke frontend dengan token
      res.redirect(`${frontend}?token=${token}`);
    } catch (error) {
      console.error("Unexpected Error:", error);
      return res.redirect(`${frontend}/error?message=${encodeURIComponent("Unexpected error occurred")}`);
    }
  })(req, res, next);
};
