import jwt from "jsonwebtoken";

const secret = "test";

function verifyToken(req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Failed to authenticate token" });
    }

    req.userId = decoded.userId;
    if (!req.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    next();
  });
}

export default verifyToken;
