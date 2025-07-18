const { UserModel } = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { sendMail } = require("../utils/sendEmail");
const ErrorHandler = require("../utils/errorHandler");

require("dotenv").config();

const registerUser = async (req, res) => {
  try {
    const { name, email, role, domains, experience, availability, password } =
      req.body;
    if (
      !name ||
      !email ||
      !role ||
      !domains ||
      !experience ||
      !availability ||
      !password
    ) {
      return new ErrorHandler(
        "Name, email, role, domains, experience, availability and password are required",
        400
      ).sendError(res);
    }

    const existingUser = await UserModel.getUserByEmail(email);
    if (existingUser) {
      return new ErrorHandler("User already exists", 409).sendError(res);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString("hex");

    const user = await UserModel.createUser({
      name,
      email,
      role,
      domains,
      experience,
      availability,
      password: hashedPassword,
      isEmailVerified: false,
      resetPasswordToken: verificationToken,
      resetPasswordExpire: new Date(Date.now() + 15 * 60 * 1000),
    });

    const verificationUrl = `http://localhost:5173/verify-email?token=${verificationToken}`;
    const emailBody = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Email Verification",
      html: `
        <p>Hello ${name},</p>
        <p>Please verify your email by clicking below:</p>
        <a href="${verificationUrl}" style="color:blue;">Verify Email</a>
        <p>This link is valid for 15 minutes.</p>
      `,
    };

    await sendMail(emailBody);

    res.status(201).json({
      success: true,
      status: 201,
      message: "User registered successfully. Verification email sent.",
      user,
    });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({
      success: false,
      status: 500,
      message: "Registration failed",
      error: error.message,
    });
  }
};

const verifyEmail = async (req, res) => {
  try {
    const token = req.query.token;
    const userId = req.params.id;

    let user;

    if (token) {
      // Verify by token (from email link)
      user = await UserModel.getUserByResetToken(token);
      if (!user || user.resetPasswordExpire < new Date()) {
        return res.status(400).json({
          success: false,
          status: 400,
          message: "Invalid or expired verification token",
        });
      }
      // Mark email verified and clear token/expiry
      await UserModel.updateUser(user.id, {
        isEmailVerified: true,
        resetPasswordToken: null,
        resetPasswordExpire: null,
      });
    } else if (userId) {
      // Verify by userId param (legacy)
      user = await UserModel.verifyEmail(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          status: 404,
          message: "User not found for verification",
        });
      }
    } else {
      return res.status(400).json({
        success: false,
        status: 400,
        message: "Verification token or user ID required",
      });
    }

    res.status(200).json({
      success: true,
      status: 200,
      message: "Email verified successfully",
      user,
    });
  } catch (error) {
    console.error("Email verification error:", error);
    res.status(500).json({
      success: false,
      status: 500,
      message: "Email verification failed",
      error: error.message,
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return new ErrorHandler("Please enter email and password", 400).sendError(
        res
      );
    }

    const user = await UserModel.getUserByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return new ErrorHandler("Invalid credentials", 401).sendError(res);
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res
      .status(200)
      .json({ success: true, status: 200, message: "Login successful", token, user });
  } catch (error) {
    console.error("Login Error:", error);
    res
      .status(500)
      .json({ success: false, status: 500, message: "Login failed", error: error.message });
  }
};

const forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return new ErrorHandler("Email is required", 400).sendError(res);
    }

    const user = await UserModel.getUserByEmail(email);
    if (!user) {
      return new ErrorHandler("User not found with this email", 404).sendError(
        res
      );
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    const expireTime = new Date(Date.now() + 15 * 60 * 1000);

    await UserModel.setResetPasswordToken(user.id, hashedToken, expireTime);

    const resetUrl = `http://localhost:5173/reset-password?token=${resetToken}`;
    const emailBody = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset Request",
      html: `
        <p>Hello,</p>
        <p>You requested a password reset. Click the link below to reset your password:</p>
        <a href="${resetUrl}" style="color:blue;">Reset Password</a>
        <p>This link is valid for 15 minutes.</p>
      `,
    };

    await sendMail(emailBody);

    res.status(200).json({
      success: true,
      status: 200,
      message: `Reset password link sent to ${email}`,
    });
  } catch (error) {
    console.error("Forget Password Error:", error);
    res
      .status(500)
      .json({ success: false, status: 500, message: "Reset failed", error: error.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    if (!token || !newPassword) {
      return new ErrorHandler(
        "Token and new password are required",
        400
      ).sendError(res);
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await UserModel.getUserByResetToken(hashedToken);

    if (!user || user.resetPasswordExpire < new Date()) {
      return new ErrorHandler("Invalid or expired token", 400).sendError(res);
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await UserModel.updateUser(user.id, {
      password: hashedPassword,
      resetPasswordToken: null,
      resetPasswordExpire: null,
    });

    res
      .status(200)
      .json({ success: true, status: 200, message: "Password reset successfully" });
  } catch (error) {
    console.error("Reset Password Error:", error);
    res
      .status(500)
      .json({ success: false, status: 500, message: "Reset failed", error: error.message });
  }
};

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.userId;

    if (!currentPassword || !newPassword) {
      return new ErrorHandler(
        "Both current and new password are required",
        400
      ).sendError(res);
    }

    const user = await UserModel.getUserById(userId);
    if (!user || !(await bcrypt.compare(currentPassword, user.password))) {
      return new ErrorHandler("Current password is incorrect", 401).sendError(
        res
      );
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await UserModel.updatePassword(userId, hashedPassword);

    res
      .status(200)
      .json({ success: true, status: 200, message: "Password updated successfully" });
  } catch (error) {
    console.error("Change Password Error:", error);
    res
      .status(500)
      .json({ success: false, status: 500, message: "Update failed", error: error.message });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await UserModel.getUserById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, status: 404, message: "User not found" });
    }

    res.status(200).json({ success: true, status: 200, user });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({
      success: false,
      status: 500,
      message: "Failed to fetch profile",
      error: error.message,
    });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const updateData = req.body;
    const updatedUser = await UserModel.updateProfile(userId, updateData);

    res
      .status(200)
      .json({ success: true, status: 200, message: "Profile updated", user: updatedUser });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({
      success: false,
      status: 500,
      message: "Failed to update profile",
      error: error.message,
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = req.user.userId;
    await UserModel.deleteUser(userId);
    res
      .status(200)
      .json({ success: true, status: 200, message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({
      success: false,
      status: 500,
      message: "Failed to delete user",
      error: error.message,
    });
  }
};

const updateOAuth = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { oauthProvider, oauthId } = req.body;
    const updated = await UserModel.updateOAuthDetails(userId, {
      oauthProvider,
      oauthId,
    });

    res.status(200).json({
      success: true,
      status: 200,
      message: "OAuth details updated",
      user: updated,
    });
  } catch (error) {
    console.error("OAuth update error:", error);
    res.status(500).json({
      success: false,
      status: 500,
      message: "Failed to update OAuth",
      error: error.message,
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  deleteUser,
  verifyEmail,
  updateOAuth,
  changePassword,
  forgetPassword,
  resetPassword,
};
