const { UserModel } = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

require("dotenv").config();

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and password are required",
      });
    }

    const existingUser = await UserModel.getUserByEmail(email);
    if (existingUser) {
      return res
        .status(409)
        .json({ success: false, message: "User already exists" });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const userData = {
      name,
      email,
      password: hashedPassword,
    };

    const user = await UserModel.createUser(userData);

    res
      .status(201)
      .json({ success: true, message: "User registered successfully", user });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({
      success: false,
      message: "Registration failed",
      error: error.message,
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.getUserByEmail(email);
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    const payload = {
      userId: user.id, // 👈 use "userId" to match auth.middleware
      email: user.email,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res
      .status(200)
      .json({ success: true, message: "Login successful", token, user });
  } catch (error) {
    console.error("Login error:", error);
    res
      .status(500)
      .json({ success: false, message: "Login failed", error: error.message });
  }
};


const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await UserModel.getUserById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({
      success: false,
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
    console.log("updatedUser",updatedUser)
    res
      .status(200)
      .json({ success: true, message: "Profile updated", user: updatedUser });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({
      success: false,
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
      .json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete user",
      error: error.message,
    });
  }
};

const verifyEmail = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await UserModel.verifyEmail(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found for verification" });
    }

    res
      .status(200)
      .json({ success: true, message: "Email verified successfully", user });
  } catch (error) {
    console.error("Email verification error:", error);
    res.status(500).json({
      success: false,
      message: "Email verification failed",
      error: error.message,
    });
  }
};

const updateOAuth = async (req, res) => {
  try {
    const userId = req.user.id;
    const { oauthProvider, oauthId } = req.body;

    const updated = await UserModel.updateOAuthDetails(userId, {
      oauthProvider,
      oauthId,
    });

    res
      .status(200)
      .json({ success: true, message: "OAuth details updated", user: updated });
  } catch (error) {
    console.error("OAuth update error:", error);
    res.status(500).json({
      success: false,
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
};
