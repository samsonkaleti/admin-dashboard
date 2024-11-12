const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers["authorization"]; // Changed to lowercase
  const token = authHeader && authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      const message =
        err.name === "TokenExpiredError"
          ? "Token expired"
          : "Failed to authenticate token";
      return res.status(403).json({ message });
    }
    req.userId = decoded.id;
    req.userRole = decoded.role;
    console.log(`User role: ${req.userRole}`);
    next();
  });
};

module.exports = { authMiddleware };