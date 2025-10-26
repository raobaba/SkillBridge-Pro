const { UserModel } = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { sendMail } = require("shared/utils/sendEmail");
const ErrorHandler = require("shared/utils/errorHandler");
const { uploadFileToSupabase } = require("shared/utils/uploadFile.utils");
const { supabase } = require("shared/utils/supabase.utils");
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
      role, // Keep for backward compatibility
      domains,
      experience,
      availability,
      password: hashedPassword,
      isEmailVerified: false,
      resetPasswordToken: verificationToken,
      resetPasswordExpire: new Date(Date.now() + 15 * 60 * 1000),
    });

    // Assign the initial role to the user
    await UserModel.assignRole(user.id, role);

    const verificationUrl = `http://localhost:5173/verify-email?token=${verificationToken}`;
    const emailBody = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "✅ Welcome to SkillBridge Pro - Verify Your Email",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">🎉 Welcome to SkillBridge Pro!</h1>
          </div>
          <div style="padding: 30px; background: #f8f9fa; border-radius: 10px; margin-top: 20px;">
            <h2 style="color: #333; margin-top: 0;">Hello ${name},</h2>
            <p style="color: #666; font-size: 16px; line-height: 1.6;">
              Thank you for joining SkillBridge Pro! We're excited to have you on board. To get started, please verify your email address.
            </p>
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #28a745;">
              <h3 style="color: #28a745; margin-top: 0;">🚀 What's Next?</h3>
              <ul style="color: #666; line-height: 1.6;">
                <li>Verify your email to activate your account</li>
                <li>Complete your profile setup</li>
                <li>Start exploring projects or posting your own</li>
                <li>Connect with developers and project owners</li>
              </ul>
            </div>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${verificationUrl}" 
                 style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 40px; text-decoration: none; border-radius: 25px; font-weight: bold; font-size: 16px; display: inline-block;">
                ✅ Verify My Email
              </a>
            </div>
            <div style="background: #fff3cd; padding: 15px; border-radius: 8px; border-left: 4px solid #ffc107; margin: 20px 0;">
              <p style="color: #856404; margin: 0; font-size: 14px;">
                <strong>⏰ Important:</strong> This verification link will expire in 15 minutes for security reasons.
              </p>
            </div>
            <p style="color: #666; font-size: 16px; line-height: 1.6;">
              If you didn't create an account with SkillBridge Pro, you can safely ignore this email.
            </p>
          </div>
          <div style="text-align: center; margin-top: 20px; color: #999; font-size: 14px;">
            <p>This email was sent from SkillBridge Pro</p>
          </div>
        </div>
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
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: "Verification token is required",
      });
    }

    const user = await UserModel.getUserByResetToken(token);

    if (!user || user.resetPasswordExpire < new Date()) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: "Invalid or expired verification token",
      });
    }

    await UserModel.updateUser(user.id, {
      isEmailVerified: true,
      resetPasswordToken: null,
      resetPasswordExpire: null,
    });

    return res.status(200).json({
      success: true,
      status: 200,
      message: "Email verified successfully",
      user,
    });
  } catch (error) {
    console.error("Email verification error:", error);
    return res.status(500).json({
      success: false,
      status: 500,
      message: "Email verification failed",
      error: error.message,
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return new ErrorHandler(
        "Please enter email, password, and role",
        400
      ).sendError(res);
    }

    // ✅ Fetch user by email
    const user = await UserModel.getUserByEmail(email);
    console.log("user", user);
    if (!user) {
      return new ErrorHandler("Invalid credentials", 401).sendError(res);
    }

    // ✅ Check if user has the requested role
    const hasRole = await UserModel.hasRole(user.id, role);
    if (!hasRole) {
      return new ErrorHandler(
        "You don't have the requested role. Please check your roles.",
        403
      ).sendError(res);
    }

    // ✅ Check password
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    console.log("isPasswordMatch", isPasswordMatch);
    if (!isPasswordMatch) {
      return new ErrorHandler("Invalid credentials", 401).sendError(res);
    }

    // 🚨 If email not verified → send verification email again
    if (!user.isEmailVerified) {
      const verificationToken = crypto.randomBytes(32).toString("hex");

      await UserModel.updateUser(user.id, {
        resetPasswordToken: verificationToken,
        resetPasswordExpire: new Date(Date.now() + 15 * 60 * 1000), // 15 min
      });

      const verificationUrl = `http://localhost:5173/verify-email?token=${verificationToken}`;
      const emailBody = {
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: "🔐 Email Verification Required - SkillBridge Pro",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px;">🔐 Email Verification Required</h1>
            </div>
            <div style="padding: 30px; background: #f8f9fa; border-radius: 10px; margin-top: 20px;">
              <h2 style="color: #333; margin-top: 0;">Hello ${user.name},</h2>
              <p style="color: #666; font-size: 16px; line-height: 1.6;">
                We noticed you're trying to log in to SkillBridge Pro, but your email address hasn't been verified yet. Please verify your email to access your account.
              </p>
              <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc3545;">
                <h3 style="color: #dc3545; margin-top: 0;">⚠️ Action Required</h3>
                <p style="color: #666; line-height: 1.6; margin: 0;">
                  To complete your login and access all features of SkillBridge Pro, please verify your email address by clicking the button below.
                </p>
              </div>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${verificationUrl}" 
                   style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 40px; text-decoration: none; border-radius: 25px; font-weight: bold; font-size: 16px; display: inline-block;">
                  ✅ Verify My Email Now
                </a>
              </div>
              <div style="background: #fff3cd; padding: 15px; border-radius: 8px; border-left: 4px solid #ffc107; margin: 20px 0;">
                <p style="color: #856404; margin: 0; font-size: 14px;">
                  <strong>⏰ Important:</strong> This verification link will expire in 15 minutes for security reasons.
                </p>
              </div>
              <p style="color: #666; font-size: 16px; line-height: 1.6;">
                Once verified, you'll be able to log in and access all the amazing features of SkillBridge Pro!
              </p>
            </div>
            <div style="text-align: center; margin-top: 20px; color: #999; font-size: 14px;">
              <p>This email was sent from SkillBridge Pro</p>
            </div>
          </div>
        `,
      };

      await sendMail(emailBody);

      return res.status(403).json({
        success: false,
        status: 403,
        message:
          "Email not verified. A new verification link has been sent to your email.",
      });
    }

    // ✅ Generate signed URLs for avatarUrl
    if (user.avatarUrl) {
      const { data, error } = await supabase.storage
        .from("upload")
        .createSignedUrl(user.avatarUrl, 60 * 60); // 1 hour
      if (!error) {
        user.avatarUrl = data.signedUrl;
      }
    }

    // ✅ Parse and generate signed URL for resumeUrl
    if (typeof user.resumeUrl === "string") {
      try {
        user.resumeUrl = JSON.parse(user.resumeUrl);
      } catch (e) {
        console.error("Failed to parse resumeUrl:", e);
        user.resumeUrl = null;
      }
    }

    if (user.resumeUrl?.path) {
      const { data, error } = await supabase.storage
        .from("upload")
        .createSignedUrl(user.resumeUrl.path, 60 * 60); // 1 hour
      if (!error) {
        user.resumeUrl = {
          url: data.signedUrl,
          originalName: user.resumeUrl.originalName,
        };
      }
    }

    // ✅ Get user roles for JWT
    const roles = await UserModel.getUserRoles(user.id);

    // ✅ Generate JWT including roles
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email, 
        role: role, // Keep for backward compatibility
        roles: roles // New: array of all user roles
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      success: true,
      status: 200,
      message: "Login successful",
      token,
      user,
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({
      success: false,
      status: 500,
      message: "Login failed",
      error: error.message,
    });
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
      subject: "🔒 Password Reset Request - SkillBridge Pro",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">🔒 Password Reset Request</h1>
          </div>
          <div style="padding: 30px; background: #f8f9fa; border-radius: 10px; margin-top: 20px;">
            <h2 style="color: #333; margin-top: 0;">Hello,</h2>
            <p style="color: #666; font-size: 16px; line-height: 1.6;">
              We received a request to reset your password for your SkillBridge Pro account. If you made this request, please click the button below to reset your password.
            </p>
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc3545;">
              <h3 style="color: #dc3545; margin-top: 0;">🔐 Security Notice</h3>
              <p style="color: #666; line-height: 1.6; margin: 0;">
                For your security, this password reset link will expire in 15 minutes. If you didn't request this reset, please ignore this email and your password will remain unchanged.
              </p>
            </div>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" 
                 style="background: linear-gradient(135deg, #dc3545 0%, #c82333 100%); color: white; padding: 15px 40px; text-decoration: none; border-radius: 25px; font-weight: bold; font-size: 16px; display: inline-block;">
                🔒 Reset My Password
              </a>
            </div>
            <div style="background: #d1ecf1; padding: 15px; border-radius: 8px; border-left: 4px solid #17a2b8; margin: 20px 0;">
              <h4 style="color: #0c5460; margin-top: 0;">💡 Security Tips:</h4>
              <ul style="color: #0c5460; line-height: 1.6; margin: 0; padding-left: 20px;">
                <li>Use a strong, unique password</li>
                <li>Don't share your password with anyone</li>
                <li>Enable two-factor authentication if available</li>
                <li>Log out from shared devices</li>
              </ul>
            </div>
            <p style="color: #666; font-size: 16px; line-height: 1.6;">
              If you're having trouble with the button above, copy and paste the following link into your browser:
            </p>
            <div style="background: #e9ecef; padding: 10px; border-radius: 5px; word-break: break-all; font-family: monospace; font-size: 12px; color: #495057;">
              ${resetUrl}
            </div>
          </div>
          <div style="text-align: center; margin-top: 20px; color: #999; font-size: 14px;">
            <p>This email was sent from SkillBridge Pro</p>
          </div>
        </div>
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
    res.status(500).json({
      success: false,
      status: 500,
      message: "Reset failed",
      error: error.message,
    });
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

    res.status(200).json({
      success: true,
      status: 200,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.error("Reset Password Error:", error);
    res.status(500).json({
      success: false,
      status: 500,
      message: "Reset failed",
      error: error.message,
    });
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

    res.status(200).json({
      success: true,
      status: 200,
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error("Change Password Error:", error);
    res.status(500).json({
      success: false,
      status: 500,
      message: "Update failed",
      error: error.message,
    });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await UserModel.getUserById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        status: 404,
        message: "User not found",
      });
    }

    // ✅ Avatar signed URL
    if (user.avatarUrl) {
      const { data, error } = await supabase.storage
        .from("upload")
        .createSignedUrl(user.avatarUrl, 60 * 60); // 1 hour
      if (!error) {
        user.avatarUrl = data.signedUrl;
      }
    }

    // ✅ ResumeUrl might be JSON or null
    if (typeof user.resumeUrl === "string") {
      try {
        user.resumeUrl = JSON.parse(user.resumeUrl);
      } catch (e) {
        console.error("Failed to parse resumeUrl:", e);
        user.resumeUrl = null;
      }
    }

    if (user.resumeUrl?.path) {
      const { data, error } = await supabase.storage
        .from("upload")
        .createSignedUrl(user.resumeUrl.path, 60 * 60); // 1 hour
      if (!error) {
        user.resumeUrl = {
          url: data.signedUrl,
          originalName: user.resumeUrl.originalName,
        };
      }
    }

    return res.status(200).json({ success: true, status: 200, user });
  } catch (error) {
    console.error("Get profile error:", error);
    return res.status(500).json({
      success: false,
      status: 500,
      message: "Failed to fetch profile",
      error: error.message,
    });
  }
};

const sanitizeNulls = (obj) => {
  for (const key in obj) {
    if (obj[key] === "null" || obj[key] === "undefined" || obj[key] === "") {
      obj[key] = null;
    }
  }
  return obj;
};

const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    let updateData = { ...req.body };

    // Normalize "null"/"undefined"/"" → null
    updateData = sanitizeNulls(updateData);

    const isInvalidUrl = (value) =>
      typeof value === "string" &&
      (value.startsWith("http") || value.includes("?token="));

    if (updateData.avatarUrl && isInvalidUrl(updateData.avatarUrl)) {
      delete updateData.avatarUrl;
    }

    if (updateData.resumeUrl && isInvalidUrl(updateData.resumeUrl)) {
      delete updateData.resumeUrl;
    }

    if (req.files?.avatar) {
      const avatarUpload = await uploadFileToSupabase(
        req.files.avatar,
        "avatars"
      );
      updateData.avatarUrl = avatarUpload.path;
    }

    if (req.files?.resume) {
      const resumeUpload = await uploadFileToSupabase(
        req.files.resume,
        "resumes"
      );
      updateData.resumeUrl = JSON.stringify({
        path: resumeUpload.path,
        originalName: resumeUpload.originalName,
      });
    }

    if (updateData.resetPasswordExpire !== undefined) {
      if (!updateData.resetPasswordExpire) {
        updateData.resetPasswordExpire = null;
      } else {
        const date = new Date(updateData.resetPasswordExpire);
        updateData.resetPasswordExpire = isNaN(date) ? null : date;
      }
    }

    // Parse skills if coming as string
    if (updateData.skills && typeof updateData.skills === "string") {
      updateData.skills = JSON.parse(updateData.skills);
    }

    const updatedUser = await UserModel.updateProfile(userId, updateData);

    return res.status(200).json({
      success: true,
      status: 200,
      message: "Profile updated",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    return res.status(500).json({
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
    res.status(200).json({
      success: true,
      status: 200,
      message: "User deleted successfully",
    });
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

// controllers/logout.controller.js
const logoutUser = async (req, res) => {
  try {
    // If you use cookies for JWT, clear the cookie
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    // Otherwise, just respond with success for client to remove token
    res.status(200).json({
      success: true,
      status: 200,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Logout Error:", error);
    res.status(500).json({
      success: false,
      status: 500,
      message: "Logout failed",
      error: error.message,
    });
  }
};

const getDevelopers = async (req, res) => {
  try {
    const { 
      search,
      experience,
      location,
      skills,
      availability,
      limit = 20,
      page = 1
    } = req.query;

    const filters = {
      search,
      experience,
      location,
      skills,
      availability,
      limit: parseInt(limit),
      page: parseInt(page)
    };

    const developers = await UserModel.getDevelopers(filters);

    // Generate signed URLs for avatars
    const developersWithSignedUrls = await Promise.all(
      developers.map(async (developer) => {
        if (developer.avatarUrl) {
          try {
            const { data, error } = await supabase.storage
              .from("upload")
              .createSignedUrl(developer.avatarUrl, 60 * 60); // 1 hour
            if (!error && data) {
              developer.avatarUrl = data.signedUrl;
            }
          } catch (error) {
            console.error("Error generating signed URL for avatar:", error);
          }
        }
        return developer;
      })
    );

    res.status(200).json({
      success: true,
      status: 200,
      developers: developersWithSignedUrls,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: developersWithSignedUrls.length
      }
    });
  } catch (error) {
    console.error("Get developers error:", error);
    res.status(500).json({
      success: false,
      status: 500,
      message: "Failed to fetch developers",
      error: error.message,
    });
  }
};

// Role Management Functions

// Assign role to user
const assignRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;
    const assignedBy = req.user.userId; // Admin who is assigning the role

    if (!role) {
      return new ErrorHandler("Role is required", 400).sendError(res);
    }

    const validRoles = ['developer', 'project-owner', 'admin'];
    if (!validRoles.includes(role)) {
      return new ErrorHandler("Invalid role. Must be one of: developer, project-owner, admin", 400).sendError(res);
    }

    // Check if user exists
    const user = await UserModel.getUserById(userId);
    if (!user) {
      return new ErrorHandler("User not found", 404).sendError(res);
    }

    // Assign the role
    const userRole = await UserModel.assignRole(userId, role, assignedBy);

    res.status(201).json({
      success: true,
      status: 201,
      message: `Role '${role}' assigned successfully`,
      data: userRole
    });
  } catch (error) {
    console.error("Assign role error:", error);
    if (error.message.includes("already has the role")) {
      return new ErrorHandler(error.message, 409).sendError(res);
    }
    res.status(500).json({
      success: false,
      status: 500,
      message: "Failed to assign role",
      error: error.message,
    });
  }
};

// Remove role from user
const removeRole = async (req, res) => {
  try {
    const { userId, role } = req.params;

    // Check if user exists
    const user = await UserModel.getUserById(userId);
    if (!user) {
      return new ErrorHandler("User not found", 404).sendError(res);
    }

    // Check if user has this role
    const hasRole = await UserModel.hasRole(userId, role);
    if (!hasRole) {
      return new ErrorHandler(`User does not have the role '${role}'`, 404).sendError(res);
    }

    // Remove the role
    const removedRole = await UserModel.removeRole(userId, role);

    res.status(200).json({
      success: true,
      status: 200,
      message: `Role '${role}' removed successfully`,
      data: removedRole
    });
  } catch (error) {
    console.error("Remove role error:", error);
    res.status(500).json({
      success: false,
      status: 500,
      message: "Failed to remove role",
      error: error.message,
    });
  }
};

// Get user roles
const getUserRoles = async (req, res) => {
  try {
    const { userId } = req.params;

    // Check if user exists
    const user = await UserModel.getUserById(userId);
    if (!user) {
      return new ErrorHandler("User not found", 404).sendError(res);
    }

    // Get user roles
    const roles = await UserModel.getUserRoles(userId);

    res.status(200).json({
      success: true,
      status: 200,
      data: {
        userId: parseInt(userId),
        roles: roles
      }
    });
  } catch (error) {
    console.error("Get user roles error:", error);
    res.status(500).json({
      success: false,
      status: 500,
      message: "Failed to fetch user roles",
      error: error.message,
    });
  }
};

// Get user with roles
const getUserWithRoles = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await UserModel.getUserWithRoles(userId);
    if (!user) {
      return new ErrorHandler("User not found", 404).sendError(res);
    }

    res.status(200).json({
      success: true,
      status: 200,
      data: user
    });
  } catch (error) {
    console.error("Get user with roles error:", error);
    res.status(500).json({
      success: false,
      status: 500,
      message: "Failed to fetch user with roles",
      error: error.message,
    });
  }
};

// Get role statistics
const getRoleStats = async (req, res) => {
  try {
    const allUsers = await UserModel.getAllUsers();
    
    // Count roles
    const roleStats = {
      developer: 0,
      'project-owner': 0,
      admin: 0
    };

    allUsers.forEach(user => {
      const roles = user.roles || [];
      roles.forEach(role => {
        if (roleStats.hasOwnProperty(role)) {
          roleStats[role]++;
        }
      });
    });

    res.status(200).json({
      success: true,
      status: 200,
      data: roleStats
    });
  } catch (error) {
    console.error("Get role stats error:", error);
    res.status(500).json({
      success: false,
      status: 500,
      message: "Failed to fetch role statistics",
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
  logoutUser,
  getDevelopers,
  // Role management functions
  assignRole,
  removeRole,
  getUserRoles,
  getUserWithRoles,
  getRoleStats,
};
