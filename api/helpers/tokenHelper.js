const jwt = require("jsonwebtoken");
const {
  JWT_EXPIRATION,
  JWT_REFRESH_EXPIRATION,
  JWT_REFRESH_SECRET,
  JWT_SECRET,
} = require("../config/jwt");

exports.generateTokens = (user) => {
  const accessToken = jwt.sign({ userId: user._id }, JWT_SECRET, {
    expiresIn: JWT_EXPIRATION,
  });
  const refreshToken = jwt.sign({ userId: user._id }, JWT_REFRESH_SECRET, {
    expiresIn: JWT_REFRESH_EXPIRATION,
  });
  return { accessToken, refreshToken };
};

exports.generateAccessTokens = (user) => {
  const accessToken = jwt.sign({ userId: user._id }, JWT_SECRET, {
    expiresIn: JWT_EXPIRATION,
  });

  return { accessToken };
};

exports.verifyAccessToken = (accessToken) => {
  return jwt.verify(accessToken, JWT_SECRET);
};

exports.verifyRefreshToken = (refreshToken) => {
  return jwt.verify(refreshToken, JWT_REFRESH_SECRET);
};
