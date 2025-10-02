const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const HttpException = require("shared/utils/HttpException.utils");

dotenv.config();

const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const bearerPrefix = "Bearer ";

    if (!authHeader || !authHeader.startsWith(bearerPrefix)) {
      return next(new HttpException(401, "Access denied. No credentials sent!"));
    }

    const token = authHeader.slice(bearerPrefix.length);
    const secretKey = process.env.JWT_SECRET;

    if (!secretKey) {
      return next(new HttpException(500, "JWT secret key not configured"));
    }

    const decoded = jwt.verify(token, secretKey);

    if (!decoded.userId || !decoded.email) {
      return next(new HttpException(401, "Invalid token payload"));
    }

    if (typeof decoded.userId !== "number" && typeof decoded.userId !== "string") {
      return next(new HttpException(401, "Invalid token userId type"));
    }

    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role || null,
      userAccess: decoded.userAccess || null,
    };

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return next(new HttpException(401, "Token has expired"));
    } else if (error.name === "JsonWebTokenError") {
      return next(new HttpException(401, "Invalid token"));
    } else if (error.name === "NotBeforeError") {
      return next(new HttpException(401, "Token not active yet"));
    }

    return next(new HttpException(401, "Authentication failed"));
  }
};

module.exports = auth;
