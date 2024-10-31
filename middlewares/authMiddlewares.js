module.exports = (req, res) => {
  console.log("Session Data:", req.session);
  console.log("User Data:", req.user);

  if (req.isAuthenticated()) {
    res.status(200).json({
      success: true,
      user: {
        id: req.user._id,
        email: req.user.email,
        username: req.user.username,
        profilePicture: req.user.profilePicture,
      },
    });
  } else {
    res.status(401).json({ success: false, message: "User not authenticated" });
  }
};
