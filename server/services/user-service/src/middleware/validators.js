/**
 * ---------------------------------
 * File: validation.js
 * Description:
 * Middleware functions to validate input data for registration and login endpoints. 
 * Ensures that all required fields are present, valid, and meet the specified criteria 
 * before proceeding with further processing.
 * 
 * Author: Rameshware Marbate
 * Created On: May-07-2025
 * Updated On: May-07-2025
 * 
 * Notes:
 * - `validateRegistration`: Checks that all required fields for user registration are provided,
 *   validates the email format, ensures the password is strong enough, and checks the role.
 * - `validateLogin`: Ensures that both email and password are provided and valid before allowing login.
 * - Both middlewares return a `400 Bad Request` status with an appropriate error message if validation fails.
 * - The email format is validated using a regular expression to match standard email patterns.
 * - Roles are predefined, and only valid roles are accepted during registration.
 * ---------------------------------
 */


/**
 * Middleware to validate registration input data.
 * Ensures that all required fields are present and valid.
 */
const validateRegistration = (req, res, next) => {
  const { email, password, firstName, lastName, roleName } = req.body;

  // Check required fields
  if (!email || !password || !firstName || !lastName || !roleName) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: "Invalid email format",
    });
  }

  // Validate password strength
  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      message: "Password must be at least 6 characters long",
    });
  }

  // Validate role
  const validRoles = ["admin", "superadmin", "agent"];
  if (!validRoles.includes(roleName)) {
    return res.status(400).json({
      success: false,
      message: `Invalid role. Available roles are: ${validRoles.join(", ")}`,
    });
  }

  next();
};

/**
 * Middleware to validate login input data.
 * Ensures that email and password are provided and valid.
 */
const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  // Check required fields
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required",
    });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: "Invalid email format",
    });
  }

  next();
};

module.exports = {
  validateRegistration,
  validateLogin,
};
