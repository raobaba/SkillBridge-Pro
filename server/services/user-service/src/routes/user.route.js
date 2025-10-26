const express = require("express");
const userController = require("../controllers/user.controller");
const authenticate = require("shared/middleware/auth.middleware");
const { requireRole } = require("shared/middleware/roleAuth.middleware");

const userRouter = express.Router();

// Auth
userRouter.post("/register", userController.registerUser);
userRouter.post("/login", userController.loginUser);

// Profile
userRouter.get("/profile", authenticate, userController.getUserProfile);
userRouter.put("/profile", authenticate, userController.updateUserProfile);
userRouter.delete("/profile", authenticate, userController.deleteUser);

// Developers
userRouter.get("/developers", authenticate, userController.getDevelopers);


// Email Verification
userRouter.get("/verify-email", userController.verifyEmail);

// OAuth Update
userRouter.put("/oauth", authenticate, userController.updateOAuth);

// Password Management
userRouter.put("/change-password", authenticate, userController.changePassword);
userRouter.post("/forgot-password", userController.forgetPassword);
userRouter.put("/reset-password/:token", userController.resetPassword);
userRouter.post("/logout", authenticate, userController.logoutUser);

// Role Management (Admin only)
userRouter.post("/:userId/roles", authenticate, requireRole(['admin']), userController.assignRole);
userRouter.delete("/:userId/roles/:role", authenticate, requireRole(['admin']), userController.removeRole);
userRouter.get("/:userId/roles", authenticate, requireRole(['admin']), userController.getUserRoles);
userRouter.get("/:userId/with-roles", authenticate, requireRole(['admin']), userController.getUserWithRoles);
userRouter.get("/roles/stats", authenticate, requireRole(['admin']), userController.getRoleStats);

module.exports = userRouter;
