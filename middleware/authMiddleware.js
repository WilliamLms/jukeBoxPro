const jwt = require('jsonwebtoken');
require('dotenv').config();

function authenticateToken(req, res, next) {
  try {
    const authHeader = req.header('Authorization');
    if (!authHeader) {
      return res.status(401).json({ error: "Unauthorized - No token provided" });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: "Unauthorized - Invalid token format" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ error: "Forbidden - Invalid or expired token" });
      }

      req.user = user;
      next();
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error in authentication" });
  }
}

module.exports = authenticateToken;
