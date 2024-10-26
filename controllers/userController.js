require("dotenv").config();
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel.js");
const bcrypt = require("bcrypt");

const { google } = require("googleapis");

const oAuth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI // Sesuaikan dengan redirect URI Anda jika diperlukan
);
oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    type: "OAuth2",
    user: process.env.EMAIL_USERNAME,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
    accessToken: oAuth2Client.getAccessToken(),
  },
});

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
    // Step 2 - Generate a verification token with the user's ID
    const verificationToken = user.generateVerificationToken();
    // Step 3 - Email the user a unique verification link
    const url = `https:/portal-berita/${verificationToken}`;
    transporter.sendMail({
      to: email,
      subject: "Verify Your Account",
      html: `
          <p style="word-break: break-all;"><a href="${url}">${url}</a></p>
      `,
    });
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

// fungsi verify email
exports.verify = async (req, res) => {
  const { token } = req.params;
  // Check we have an id
  if (!token) {
    return res.status(422).send({
      message: "Missing Token",
    });
  }
  // Step 1 -  Verify the token from the URL
  let payload = null;
  try {
    payload = jwt.verify(token, process.env.USER_VERIFICATION_TOKEN_SECRET);
  } catch (err) {
    return res.status(500).send(err);
  }
  try {
    // Step 2 - Find user with matching ID
    const user = await User.findOne({ _id: payload.ID }).exec();
    if (!user) {
      return res.status(404).send({
        message: "User does not  exists",
      });
    }
    // Step 3 - Update user verification status to true
    user.verified = true;
    await user.save();
    return res.status(200).send({
      message: "Account Verified",
    });
  } catch (err) {
    return res.status(500).send(err);
  }
};
