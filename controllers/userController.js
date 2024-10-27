require("dotenv").config();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel.js");
const bcrypt = require("bcrypt");
const passport = require("passport");

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
    const user = await new User({
      _id: new mongoose.Types.ObjectId(),
      email: email,
      username: username,
      password: hashedPassword,
    }).save();

    return res.status(201).send({
      message: `Sent a verification email to ${email}`,
    });
  } catch (err) {
    return res.status(500).send(err);
  }
};

// fungsi login
exports.login = async (req, res) => {
  const { username, password } = req.body;
  console.log("Login attempt:", { username, password });

  try {
    // Step 1 - Verify a user with the username exists
    const user = await User.findOne({ username }).exec();
    if (!user) {
      console.log("User not found:", username);
      return res.status(404).send({
        error: "Email atau Password salah",
      });
    }

    // Step 2 - Ensure the account has been verified
    if (!user.verified) {
      console.log("Account not verified:", username);
      return res.status(403).send({
        message: "Verify your Account.",
      });
    }

    // Step 3 - Check if the password matches
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (passwordMatch) {
      const token = jwt.sign({ id: user._id, name: user.name, role: user.role }, process.env.JWT_KEY, { expiresIn: "24h" });
      console.log("Login successful for user:", username);
      return res.status(200).json({
        message: "Login Successfully",
        token,
      });
    } else {
      console.log("Incorrect password for user:", username);
      return res.status(401).json({ error: "Email atau Password salah" });
    }
  } catch (err) {
    console.error("Internal server error during login:", err);
    return res.status(500).send({ message: "Internal Server Error", error: err });
  }
};

exports.loginWithGoogle = passport.authenticate("google", { scope: ["profile", "email"] });

exports.googleCallback = passport.authenticate("google", { failureRedirect: "/login" });

exports.redirectAfterLogin = (req, res) => {
  res.redirect("/dashboard");
};

exports.logout = (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
};
