const { verifyAccessToken } = require("../helpers/tokenHelper");
const verifyAuthToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1]; // Extract token from Authorization header

  if (!token) {
    return res.status(401).json({ message: "Access Token is required" });
  }

  try {
    const decoded = verifyAccessToken(token);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid Access Token" });
  }
};

module.exports = verifyAuthToken;
