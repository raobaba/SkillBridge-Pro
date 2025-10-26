const HttpException = require("shared/utils/HttpException.utils");

/**
 * Role-based authorization middleware
 * @param {string[]} allowedRoles - Array of roles that are allowed to access the endpoint
 * @returns {Function} Express middleware function
 */
const requireRole = (allowedRoles) => {
  return (req, res, next) => {
    try {
      // Check if user is authenticated (should be called after auth middleware)
      if (!req.user) {
        return next(new HttpException(401, "Authentication required"));
      }

      // Get user roles from JWT token (support both old and new format)
      const userRoles = req.user.roles || (req.user.role ? [req.user.role] : []);
      const userRole = req.user.role; // Keep for backward compatibility

      if (!userRoles || userRoles.length === 0) {
        return next(new HttpException(403, "User roles not found in token"));
      }

      // Check if user has any of the allowed roles
      const hasRequiredRole = userRoles.some(role => allowedRoles.includes(role));
      
      if (!hasRequiredRole) {
        return next(new HttpException(403, `Access denied. Required roles: ${allowedRoles.join(', ')}. Your roles: ${userRoles.join(', ')}`));
      }

      next();
    } catch (error) {
      return next(new HttpException(500, "Role authorization failed"));
    }
  };
};

/**
 * Middleware to check if user is a project owner or admin
 */
const requireProjectOwner = requireRole(['project-owner', 'admin']);

/**
 * Middleware to check if user is an admin
 */
const requireAdmin = requireRole(['admin']);

/**
 * Middleware to check if user is a developer (for applying to projects)
 */
const requireDeveloper = requireRole(['developer']);

/**
 * Middleware to allow project owners and admins (for project management)
 */
const requireProjectManager = requireRole(['project-owner', 'admin']);

module.exports = {
  requireRole,
  requireProjectOwner,
  requireAdmin,
  requireDeveloper,
  requireProjectManager
};
