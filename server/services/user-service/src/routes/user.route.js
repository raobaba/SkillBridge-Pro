const express = require("express");
const userController = require("../controllers/user.controller");
const authenticate = require("../middleware/auth.middleware");

const userRouter = express.Router();

// Auth
userRouter.post("/register", userController.registerUser);
userRouter.post("/login", userController.loginUser);

// Profile
userRouter.get("/profile", authenticate, userController.getUserProfile);
userRouter.put("/profile", authenticate, userController.updateUserProfile);
userRouter.delete("/profile", authenticate, userController.deleteUser);

// Email Verification
userRouter.get("/verify-email", userController.verifyEmail);

// OAuth Update
userRouter.put("/oauth", authenticate, userController.updateOAuth);

// Password Management
userRouter.put("/change-password", authenticate, userController.changePassword);
userRouter.post("/forgot-password", userController.forgetPassword);
userRouter.put("/reset-password/:token", userController.resetPassword);
userRouter.post("/logout", authenticate, userController.logoutUser);

module.exports = userRouter;
