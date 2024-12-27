const bcrypt = require("bcryptjs");
const {
  generateTokens,
  verifyRefreshToken,
  generateAccessTokens,
} = require("../helpers/tokenHelper");
const User = require("../models/user");
const responseHelper = require("../helpers/responseHelper");
const { signupSchema, loginSchema } = require("../validations/authSchema");

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return responseHelper.error(res, {}, "Invalid credentials", 400);
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return responseHelper.error(res, {}, "Invalid credentials", 400);
    }

    // Generate JWT tokens
    const tokens = generateTokens(user);

    return responseHelper.success(
      res,
      {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      },
      "Login successful"
    );
  } catch (error) {
    console.log(error);
    return responseHelper.error(res, error, "Server error during login", 500);
  }
};

exports.signup = async (req, res) => {
  const { name, email, password, username } = req.body;

  try {
    // Check if the user already exists
    let user = await User.findOne({ $or: [{ email }, { username }] });
    if (user) {
      return responseHelper.error(res, null, "User already exists", 400);
    }   

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    user = new User({
      name,
      email,
      password: hashedPassword,
      username,
    });

    // Save the user to the database
    await user.save();

    return responseHelper.success(
      res,
      user,
      "User registered successfully",
      201
    );
  } catch (error) {
    return responseHelper.error(
      res,
      error,
      "Server error during registration",
      500
    );
  }
};

// Refresh access token
exports.refreshToken = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return responseHelper.error(res, {}, "Refresh token is required", 400);
  }

  try {
    // Verify the refresh token
    const decoded = verifyRefreshToken(refreshToken);

    // Find the user associated with the refresh token
    const user = await User.findById(decoded.userId);
    if (!user) {
      return responseHelper.error(res, {}, "User not found", 401);
    }

    // Generate new tokens
    const tokens = generateAccessTokens(user);

    return responseHelper.success(
      res,
      {
        accessToken: tokens.accessToken,
      },
      "Token refreshed successfully"
    );
  } catch (error) {
    return responseHelper.error(res, error, "Invalid refresh token", 403);
  }
};
