const jwt = require("jsonwebtoken");

// Middleware untuk Verifikasi JWT
exports.verifyToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res.status(403).json({ success: false, message: "No token provided" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ success: false, message: "Failed to authenticate token" });
    }

    req.userId = decoded.id; // Dekode data pengguna
    next();
  });
};
