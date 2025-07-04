const jwt = require("jsonwebtoken");
const { User } = require("../../../shared-lib/index");
const asyncErrorHandler = require("./asyncErrorHandler");

const isAuthenticatedUser = asyncErrorHandler(async (req, res, next) => {
  const authHeader = req.header("Authorization");

  // Check if the Authorization header is present
  if (!authHeader) {
    console.log("Authorization header is missing");
    return res.status(401).json({ error: "Authorization header missing" });
  }

  // Check if the header contains the "Bearer" token format
  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    console.log("Authorization token is malformed:", authHeader);
    return res
      .status(401)
      .json({ error: "Authorization token missing or malformed" });
  }

  const token = parts[1];

  // ✅ Log the token to check if it's coming correctly
  console.log("Received JWT token:", token);

  // Verify the token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      console.log("User not found for token:", decoded.id);
      return res.status(401).json({ error: "Invalid token or user not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log("JWT verification failed:", error.message);
    return res.status(401).json({ error: "Invalid token" });
  }
});

module.exports = isAuthenticatedUser;
