const jwt = require("jsonwebtoken");

/**
 * Socket.io authentication middleware
 * Verifies JWT token from handshake auth
 */
const socketAuth = (socket, next) => {
  try {
    const token = socket.handshake.auth?.token || socket.handshake.headers?.authorization?.replace("Bearer ", "");

    if (!token) {
      return next(new Error("Authentication error: No token provided"));
    }

    const secretKey = process.env.JWT_SECRET;
    if (!secretKey) {
      return next(new Error("JWT secret key not configured"));
    }

    const decoded = jwt.verify(token, secretKey);

    if (!decoded.userId || !decoded.email) {
      return next(new Error("Invalid token payload"));
    }

    // Attach user info to socket
    socket.user = {
      userId: decoded.userId,
      id: decoded.userId, // For compatibility
      email: decoded.email,
      role: decoded.role || null,
      roles: decoded.roles || [],
    };

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return next(new Error("Token has expired"));
    } else if (error.name === "JsonWebTokenError") {
      return next(new Error("Invalid token"));
    }
    return next(new Error("Authentication failed"));
  }
};

module.exports = socketAuth;

