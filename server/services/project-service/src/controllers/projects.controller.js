const { ProjectModel } = require("../models");
const { FilterOptionsModel } = require("../models/filter-options.model");
const { uploadFileToSupabase } = require("shared/utils/uploadFile.utils");
const { supabase } = require("shared/utils/supabase.utils");
const { db } = require("../config/database");
const { ilike, asc, sql } = require("drizzle-orm");
const { sendMail } = require("shared/utils/sendEmail");

// Basic error helper to keep responses consistent
const sendError = (res, message, status = 400) =>
  res.status(status).json({ success: false, status, message });

// Helper function to get user information directly from database
// Required environment variables:
// - EMAIL_USER: Gmail address for sending emails
// - EMAIL_PASS: Gmail app password for sending emails
// - FRONTEND_URL: Frontend URL for email links (default: http://localhost:5173)
const getUserInfo = async (userId) => {
  try {
    // Get user information directly from the database using the same connection
    // Import the user table from the shared database schema
    // Note: This assumes the project service has access to the same database
    const userQuery = await db.execute(sql`
      SELECT id, name, email, role 
      FROM users 
      WHERE id = ${userId} AND is_deleted = false
    `);
    
    if (userQuery.rows && userQuery.rows.length > 0) {
      return userQuery.rows[0];
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching user info:', error.message);
    return null;
  }
};

// Helper function to send application confirmation email to developer
const sendApplicationConfirmationEmail = async (developerEmail, developerName, projectTitle, projectOwnerName) => {
  try {
    const emailBody = {
      from: process.env.EMAIL_USER,
      to: developerEmail,
      subject: `✅ Application Submitted: "${projectTitle}"`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">✅ Application Submitted!</h1>
          </div>
          <div style="padding: 30px; background: #f8f9fa; border-radius: 10px; margin-top: 20px;">
            <h2 style="color: #333; margin-top: 0;">Hello ${developerName},</h2>
            <p style="color: #666; font-size: 16px; line-height: 1.6;">
              Thank you for applying to <strong>"${projectTitle}"</strong>! Your application has been successfully submitted to <strong>${projectOwnerName}</strong>.
            </p>
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #28a745;">
              <h3 style="color: #28a745; margin-top: 0;">What Happens Next?</h3>
              <ul style="color: #666; line-height: 1.6;">
                <li>The project owner will review your application</li>
                <li>You'll be notified if you're shortlisted for an interview</li>
                <li>Keep an eye on your email for updates</li>
                <li>You can track your application status in your dashboard</li>
              </ul>
            </div>
            <p style="color: #666; font-size: 16px; line-height: 1.6;">
              We wish you the best of luck with your application!
            </p>
            <div style="text-align: center; margin-top: 30px;">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/project" 
                 style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; font-weight: bold;">
                View My Applications
              </a>
            </div>
          </div>
          <div style="text-align: center; margin-top: 20px; color: #999; font-size: 14px;">
            <p>This email was sent from SkillBridge Pro</p>
          </div>
        </div>
      `
    };

    await sendMail(emailBody);
    console.log(`✅ Application confirmation email sent to ${developerEmail}`);
  } catch (error) {
    console.error('❌ Error sending application confirmation email:', error);
    // Don't throw error to avoid breaking the main flow
  }
};

// Helper function to send new application notification to project owner
const sendNewApplicationNotificationEmail = async (ownerEmail, ownerName, projectTitle, developerName, developerEmail) => {
  try {
    const emailBody = {
      from: process.env.EMAIL_USER,
      to: ownerEmail,
      subject: `🔔 New Application for "${projectTitle}"`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">🔔 New Application!</h1>
          </div>
          <div style="padding: 30px; background: #f8f9fa; border-radius: 10px; margin-top: 20px;">
            <h2 style="color: #333; margin-top: 0;">Hello ${ownerName},</h2>
            <p style="color: #666; font-size: 16px; line-height: 1.6;">
              You have received a new application for your project <strong>"${projectTitle}"</strong>!
            </p>
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #007bff;">
              <h3 style="color: #007bff; margin-top: 0;">Applicant Details</h3>
              <p style="color: #666; line-height: 1.6; margin: 0;">
                <strong>Name:</strong> ${developerName}<br>
                <strong>Email:</strong> ${developerEmail}
              </p>
            </div>
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107;">
              <h3 style="color: #ffc107; margin-top: 0;">Next Steps</h3>
              <ul style="color: #666; line-height: 1.6;">
                <li>Review the applicant's profile and application</li>
                <li>Shortlist promising candidates for interviews</li>
                <li>Update application status to keep applicants informed</li>
                <li>Contact applicants directly if needed</li>
              </ul>
            </div>
            <p style="color: #666; font-size: 16px; line-height: 1.6;">
              Don't keep applicants waiting - timely responses help you find the best talent!
            </p>
            <div style="text-align: center; margin-top: 30px;">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/project" 
                 style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; font-weight: bold;">
                Review Applications
              </a>
            </div>
          </div>
          <div style="text-align: center; margin-top: 20px; color: #999; font-size: 14px;">
            <p>This email was sent from SkillBridge Pro</p>
          </div>
        </div>
      `
    };

    await sendMail(emailBody);
    console.log(`✅ New application notification email sent to ${ownerEmail}`);
  } catch (error) {
    console.error('❌ Error sending new application notification email:', error);
    // Don't throw error to avoid breaking the main flow
  }
};

// Helper function to send developer invite email
const sendDeveloperInviteEmail = async (invitedEmail, invitedName, projectTitle, projectOwnerName, role, message, inviteId) => {
  try {
    const inviteUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/invites/${inviteId}`;
    
    const emailBody = {
      from: process.env.EMAIL_USER,
      to: invitedEmail,
      subject: `🎯 You're Invited to Join "${projectTitle}"`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">🎯 Project Invitation</h1>
          </div>
          <div style="padding: 30px; background: #f8f9fa; border-radius: 10px; margin-top: 20px;">
            <h2 style="color: #333; margin-top: 0;">Hello ${invitedName || 'Developer'},</h2>
            <p style="color: #666; font-size: 16px; line-height: 1.6;">
              <strong>${projectOwnerName}</strong> has invited you to join their project <strong>"${projectTitle}"</strong>!
            </p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #007bff;">
              <h3 style="color: #007bff; margin-top: 0;">Project Details</h3>
              <p style="color: #666; line-height: 1.6; margin: 0;">
                <strong>Project:</strong> ${projectTitle}<br>
                <strong>Role:</strong> ${role || 'Developer'}<br>
                <strong>Invited by:</strong> ${projectOwnerName}
              </p>
            </div>
            
            ${message ? `
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #28a745;">
              <h3 style="color: #28a745; margin-top: 0;">Personal Message</h3>
              <p style="color: #666; line-height: 1.6; margin: 0; font-style: italic;">
                "${message}"
              </p>
            </div>
            ` : ''}
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107;">
              <h3 style="color: #ffc107; margin-top: 0;">What's Next?</h3>
              <ul style="color: #666; line-height: 1.6;">
                <li>Click the button below to view the full project details</li>
                <li>Review the project requirements and your role</li>
                <li>Accept or decline the invitation</li>
                <li>Start collaborating if you accept!</li>
              </ul>
            </div>
            
            <p style="color: #666; font-size: 16px; line-height: 1.6;">
              This is a great opportunity to work on an exciting project. We hope you'll consider joining!
            </p>
            
            <div style="text-align: center; margin-top: 30px;">
              <a href="${inviteUrl}" 
                 style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 40px; text-decoration: none; border-radius: 25px; font-weight: bold; font-size: 16px; display: inline-block;">
                View Invitation & Respond
              </a>
            </div>
            
            <div style="text-align: center; margin-top: 20px;">
              <p style="color: #999; font-size: 14px; margin: 0;">
                Or copy and paste this link: <a href="${inviteUrl}" style="color: #667eea;">${inviteUrl}</a>
              </p>
            </div>
          </div>
          <div style="text-align: center; margin-top: 20px; color: #999; font-size: 14px;">
            <p>This invitation was sent from SkillBridge Pro</p>
          </div>
        </div>
      `
    };

    await sendMail(emailBody);
    console.log(`✅ Developer invite email sent to ${invitedEmail} for project: ${projectTitle}`);
  } catch (error) {
    console.error('❌ Error sending developer invite email:', error);
    // Don't throw error to avoid breaking the main flow
  }
};

// Helper function to send invite response notification email to project owner
const sendInviteResponseNotificationEmail = async (ownerEmail, ownerName, projectTitle, responderName, responderEmail, status) => {
  try {
    const statusMessages = {
      accepted: {
        subject: `🎉 Invitation Accepted for "${projectTitle}"`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); padding: 30px; border-radius: 10px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px;">🎉 Invitation Accepted!</h1>
            </div>
            <div style="padding: 30px; background: #f8f9fa; border-radius: 10px; margin-top: 20px;">
              <h2 style="color: #333; margin-top: 0;">Hello ${ownerName},</h2>
              <p style="color: #666; font-size: 16px; line-height: 1.6;">
                Great news! <strong>${responderName}</strong> has accepted your invitation to join <strong>"${projectTitle}"</strong>!
              </p>
              
              <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #28a745;">
                <h3 style="color: #28a745; margin-top: 0;">Developer Details</h3>
                <p style="color: #666; line-height: 1.6; margin: 0;">
                  <strong>Name:</strong> ${responderName}<br>
                  <strong>Email:</strong> ${responderEmail}
                </p>
              </div>
              
              <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #007bff;">
                <h3 style="color: #007bff; margin-top: 0;">Next Steps</h3>
                <ul style="color: #666; line-height: 1.6;">
                  <li>Welcome the new team member to your project</li>
                  <li>Share project details and access credentials</li>
                  <li>Set up communication channels</li>
                  <li>Begin collaboration on the project</li>
                </ul>
              </div>
              
              <p style="color: #666; font-size: 16px; line-height: 1.6;">
                Your project team is growing! Time to start building something amazing together.
              </p>
              
              <div style="text-align: center; margin-top: 30px;">
                <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/project/${projectTitle.replace(/\s+/g, '-').toLowerCase()}" 
                   style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 15px 40px; text-decoration: none; border-radius: 25px; font-weight: bold; font-size: 16px; display: inline-block;">
                  View Project
                </a>
              </div>
            </div>
            <div style="text-align: center; margin-top: 20px; color: #999; font-size: 14px;">
              <p>This notification was sent from SkillBridge Pro</p>
            </div>
          </div>
        `
      },
      declined: {
        subject: `📝 Invitation Declined for "${projectTitle}"`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #6c757d 0%, #495057 100%); padding: 30px; border-radius: 10px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px;">📝 Invitation Declined</h1>
            </div>
            <div style="padding: 30px; background: #f8f9fa; border-radius: 10px; margin-top: 20px;">
              <h2 style="color: #333; margin-top: 0;">Hello ${ownerName},</h2>
              <p style="color: #666; font-size: 16px; line-height: 1.6;">
                <strong>${responderName}</strong> has declined your invitation to join <strong>"${projectTitle}"</strong>.
              </p>
              
              <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #6c757d;">
                <h3 style="color: #6c757d; margin-top: 0;">Developer Details</h3>
                <p style="color: #666; line-height: 1.6; margin: 0;">
                  <strong>Name:</strong> ${responderName}<br>
                  <strong>Email:</strong> ${responderEmail}
                </p>
              </div>
              
              <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107;">
                <h3 style="color: #ffc107; margin-top: 0;">Don't Give Up!</h3>
                <ul style="color: #666; line-height: 1.6;">
                  <li>Continue searching for other qualified developers</li>
                  <li>Consider reaching out to more candidates</li>
                  <li>Review your project requirements and make them more attractive</li>
                  <li>Post your project publicly to reach a wider audience</li>
                </ul>
              </div>
              
              <p style="color: #666; font-size: 16px; line-height: 1.6;">
                There are many talented developers out there. Keep looking and you'll find the perfect match for your project!
              </p>
              
              <div style="text-align: center; margin-top: 30px;">
                <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/project" 
                   style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 40px; text-decoration: none; border-radius: 25px; font-weight: bold; font-size: 16px; display: inline-block;">
                  Find More Developers
                </a>
              </div>
            </div>
            <div style="text-align: center; margin-top: 20px; color: #999; font-size: 14px;">
              <p>This notification was sent from SkillBridge Pro</p>
            </div>
          </div>
        `
      }
    };

    const emailTemplate = statusMessages[status];
    if (!emailTemplate) {
      console.log(`No email template found for invite response status: ${status}`);
      return;
    }

    const emailBody = {
      from: process.env.EMAIL_USER,
      to: ownerEmail,
      subject: emailTemplate.subject,
      html: emailTemplate.html
    };

    await sendMail(emailBody);
    console.log(`✅ Invite response notification email sent to ${ownerEmail} for status: ${status}`);
  } catch (error) {
    console.error('❌ Error sending invite response notification email:', error);
    // Don't throw error to avoid breaking the main flow
  }
};

// Helper function to send application status email
const sendApplicationStatusEmail = async (userEmail, userName, projectTitle, status, projectOwnerName) => {
  try {
    const statusMessages = {
      shortlisted: {
        subject: `🎉 Great News! You've been shortlisted for "${projectTitle}"`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px;">🎉 Congratulations!</h1>
            </div>
            <div style="padding: 30px; background: #f8f9fa; border-radius: 10px; margin-top: 20px;">
              <h2 style="color: #333; margin-top: 0;">Hello ${userName},</h2>
              <p style="color: #666; font-size: 16px; line-height: 1.6;">
                We're excited to inform you that your application for <strong>"${projectTitle}"</strong> has been <strong style="color: #28a745;">shortlisted</strong>!
              </p>
              <p style="color: #666; font-size: 16px; line-height: 1.6;">
                The project owner, <strong>${projectOwnerName}</strong>, was impressed with your profile and would like to move forward with your application.
              </p>
              <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #28a745;">
                <h3 style="color: #28a745; margin-top: 0;">What's Next?</h3>
                <ul style="color: #666; line-height: 1.6;">
                  <li>You may be contacted for an interview or further discussion</li>
                  <li>Keep an eye on your email for updates from the project owner</li>
                  <li>Be prepared to discuss your experience and availability</li>
                </ul>
              </div>
              <p style="color: #666; font-size: 16px; line-height: 1.6;">
                Thank you for your interest in this project. We wish you the best of luck!
              </p>
              <div style="text-align: center; margin-top: 30px;">
                <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/project" 
                   style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; font-weight: bold;">
                  View Project Details
                </a>
              </div>
            </div>
            <div style="text-align: center; margin-top: 20px; color: #999; font-size: 14px;">
              <p>This email was sent from SkillBridge Pro</p>
            </div>
          </div>
        `
      },
      rejected: {
        subject: `Application Update: "${projectTitle}"`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px;">Application Update</h1>
            </div>
            <div style="padding: 30px; background: #f8f9fa; border-radius: 10px; margin-top: 20px;">
              <h2 style="color: #333; margin-top: 0;">Hello ${userName},</h2>
              <p style="color: #666; font-size: 16px; line-height: 1.6;">
                Thank you for your interest in <strong>"${projectTitle}"</strong>. After careful consideration, we regret to inform you that your application has not been selected for this project.
              </p>
              <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #6c757d;">
                <h3 style="color: #6c757d; margin-top: 0;">Don't Give Up!</h3>
                <ul style="color: #666; line-height: 1.6;">
                  <li>This decision doesn't reflect on your skills or potential</li>
                  <li>Keep applying to other projects that match your expertise</li>
                  <li>Consider updating your profile to make it more attractive to project owners</li>
                  <li>Use this as an opportunity to improve and grow</li>
                </ul>
              </div>
              <p style="color: #666; font-size: 16px; line-height: 1.6;">
                We encourage you to continue exploring other opportunities on our platform. Your next great project is just around the corner!
              </p>
              <div style="text-align: center; margin-top: 30px;">
                <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/project" 
                   style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; font-weight: bold;">
                  Explore More Projects
                </a>
              </div>
            </div>
            <div style="text-align: center; margin-top: 20px; color: #999; font-size: 14px;">
              <p>This email was sent from SkillBridge Pro</p>
            </div>
          </div>
        `
      }
    };

    const emailTemplate = statusMessages[status];
    if (!emailTemplate) {
      console.log(`No email template found for status: ${status}`);
      return;
    }

    const emailBody = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: emailTemplate.subject,
      html: emailTemplate.html
    };

    await sendMail(emailBody);
    console.log(`✅ Application status email sent to ${userEmail} for status: ${status}`);
  } catch (error) {
    console.error('❌ Error sending application status email:', error);
    // Don't throw error to avoid breaking the main flow
  }
};

// Create a new project
const createProject = async (req, res) => {
  try {
    // Only use authenticated user's ID - no fallback to body for security
    const ownerId = req.user?.userId;
    const {
      title,
      description,
      roleNeeded,
      status,
      priority,
      category,
      experienceLevel,
      budgetMin,
      budgetMax,
      currency,
      isRemote,
      isUrgent,
      isFeatured,
      location,
      duration,
      startDate,
      deadline,
      requirements,
      benefits,
      company,
      website,
      maxApplicants,
      language,
      timezone,
      skills = [],
      tags = [],
    } = req.body;

    if (!ownerId || !title || !description || !roleNeeded) {
      return sendError(
        res,
        "ownerId, title, description, and roleNeeded are required",
        400
      );
    }

    const project = await ProjectModel.createProject({
      ownerId,
      title,
      description,
      roleNeeded,
      status,
      priority,
      category,
      experienceLevel,
      budgetMin,
      budgetMax,
      currency,
      isRemote,
      isUrgent,
      isFeatured,
      location,
      duration,
      startDate: startDate ? new Date(startDate) : null,
      deadline: deadline ? new Date(deadline) : null,
      requirements,
      benefits,
      company,
      website,
      maxApplicants,
      language,
      timezone,
    });

    if (skills?.length) await ProjectModel.setSkills(project.id, skills);
    if (tags?.length) await ProjectModel.setTags(project.id, tags);

    return res.status(201).json({
      success: true,
      status: 201,
      message: "Project created successfully",
      project,
    });
  } catch (error) {
    console.error("Create Project Error:", error);
    return res
      .status(500)
      .json({ success: false, status: 500, message: "Creation failed", error: error.message });
  }
};

// Get a single project by ID
const getProject = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || id === 'null' || id === 'undefined') {
      return sendError(res, "Project id is required", 400);
    }
    
    const projectId = Number(id);
    if (isNaN(projectId) || projectId <= 0) {
      return sendError(res, "Invalid project id", 400);
    }
    
    const project = await ProjectModel.getProjectById(projectId);
    if (!project) return sendError(res, "Project not found", 404);
    return res.status(200).json({ success: true, status: 200, project });
  } catch (error) {
    console.error("Get Project Error:", error);
    return res
      .status(500)
      .json({ success: false, status: 500, message: "Failed to fetch project", error: error.message });
  }
};

// List projects (optionally filter by ownerId, status)
const listProjects = async (req, res) => {
  try {
    const { 
      ownerId, 
      query,
      status, 
      priority,
      category, 
      experienceLevel, 
      isRemote, 
      location,
      budgetMin,
      budgetMax,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      limit = 20, 
      page = 1 
    } = req.query;
    
    // Include ownerId in filters for authenticated requests
    const filters = { 
      ownerId: ownerId ? Number(ownerId) : undefined,
      query,
      status,
      priority,
      category,
      experienceLevel,
      isRemote: isRemote !== undefined ? isRemote === 'true' : undefined,
      location,
      budgetMin: budgetMin ? Number(budgetMin) : undefined,
      budgetMax: budgetMax ? Number(budgetMax) : undefined,
      sortBy,
      sortOrder,
      limit: Number(limit),
      page: Number(page)
    };
    
    // Remove undefined values
    Object.keys(filters).forEach(key => {
      if (filters[key] === undefined) {
        delete filters[key];
      }
    });
    
    const result = await ProjectModel.searchProjects(filters);
    return res.status(200).json({ 
      success: true, 
      status: 200, 
      projects: result.projects,
      pagination: result.pagination
    });
  } catch (error) {
    console.error("List Projects Error:", error);
    return res
      .status(500)
      .json({ success: false, status: 500, message: "Failed to fetch projects", error: error.message });
  }
};

// Get public projects for developer discovery (no authentication required)
const getPublicProjects = async (req, res) => {
  try {
    const { 
      query,
      category, 
      experienceLevel, 
      isRemote, 
      location, 
      budgetMin, 
      budgetMax,
      status, // Don't default to 'active' - let frontend control this
      priority,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      limit = 20, 
      page = 1 
    } = req.query;

    // Build filters for public access
    const filters = {
      query,
      status, // Only show active projects by default
      priority,
      category,
      experienceLevel,
      isRemote: isRemote !== undefined ? isRemote === 'true' : undefined,
      location,
      budgetMin: budgetMin ? Number(budgetMin) : undefined,
      budgetMax: budgetMax ? Number(budgetMax) : undefined,
      sortBy,
      sortOrder,
      limit: Number(limit),
      page: Number(page)
    };

    // Remove undefined values
    Object.keys(filters).forEach(key => {
      if (filters[key] === undefined) {
        delete filters[key];
      }
    });

    // Debug logging
    console.log('🔍 Public Projects Filter Debug:', {
      originalQuery: req.query,
      processedFilters: filters,
      timestamp: new Date().toISOString(),
      rawQueryString: JSON.stringify(req.query, null, 2)
    });

    const result = await ProjectModel.searchProjects(filters);
    
    console.log('📊 Filter Results:', {
      projectsFound: result.projects.length,
      totalCount: result.pagination.total,
      filters: filters
    });
    
    return res.status(200).json({ 
      success: true, 
      status: 200, 
      projects: result.projects,
      pagination: result.pagination,
      filters: {
        query,
        category,
        experienceLevel,
        isRemote,
        location,
        budgetMin,
        budgetMax,
        status,
        priority,
        skills: filters.skills,
        tags: filters.tags
      }
    });
  } catch (error) {
    console.error("Get Public Projects Error:", error);
    return res
      .status(500)
      .json({ success: false, status: 500, message: "Failed to fetch public projects", error: error.message });
  }
};

// Get project categories (public metadata)
const getProjectCategories = async (req, res) => {
  try {
    const categories = [
      'Web Development',
      'Mobile Development', 
      'Desktop Application',
      'Backend Development',
      'Frontend Development',
      'Full Stack Development',
      'DevOps',
      'Data Science',
      'Machine Learning',
      'AI Development',
      'Blockchain',
      'Game Development',
      'UI/UX Design',
      'Graphic Design',
      'Content Writing',
      'Digital Marketing',
      'SEO',
      'Video Editing',
      'Audio Production',
      'Translation',
      'Research',
      'Consulting',
      'Other'
    ];

    return res.status(200).json({ 
      success: true, 
      status: 200, 
      categories 
    });
  } catch (error) {
    console.error("Get Project Categories Error:", error);
    return res
      .status(500)
      .json({ success: false, status: 500, message: "Failed to fetch categories", error: error.message });
  }
};

// Get project metadata (experience levels, priorities, etc.)
// Removed getProjectMetadata - replaced by getFilterOptions which provides dynamic, database-driven filter options

// Get all filter options (public endpoint)
const getFilterOptions = async (req, res) => {
  try {
    const filterOptions = await FilterOptionsModel.getAllFilterOptions();
    
    return res.status(200).json({ 
      success: true, 
      status: 200, 
      filterOptions 
    });
  } catch (error) {
    console.error("Get Filter Options Error:", error);
    return res
      .status(500)
      .json({ success: false, status: 500, message: "Failed to fetch filter options", error: error.message });
  }
};

// Update project
const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;
    const userRole = req.user?.role;
    
    if (!id) return sendError(res, "Project id is required", 400);
    
    // Check if project exists and user has permission to update it
    const existingProject = await ProjectModel.getProjectById(Number(id));
    if (!existingProject) return sendError(res, "Project not found", 404);
    
    // Only project owner or admin can update (admin can update any project)
    if (userRole !== 'admin' && existingProject.ownerId !== userId) {
      return sendError(res, "You can only update your own projects", 403);
    }
    
    const payload = { ...req.body };
    if (payload.startDate) payload.startDate = new Date(payload.startDate);
    if (payload.deadline) payload.deadline = new Date(payload.deadline);

    const project = await ProjectModel.updateProject(Number(id), payload);
    if (!project) return sendError(res, "Project update failed", 500);

    if (Array.isArray(payload.skills)) await ProjectModel.setSkills(project.id, payload.skills);
    if (Array.isArray(payload.tags)) await ProjectModel.setTags(project.id, payload.tags);

    return res.status(200).json({ success: true, status: 200, message: "Project updated", project });
  } catch (error) {
    console.error("Update Project Error:", error);
    return res
      .status(500)
      .json({ success: false, status: 500, message: "Update failed", error: error.message });
  }
};

// Soft delete
const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;
    const userRole = req.user?.role;
    
    if (!id) return sendError(res, "Project id is required", 400);
    
    // Check if project exists and user has permission to delete it
    const existingProject = await ProjectModel.getProjectById(Number(id));
    if (!existingProject) return sendError(res, "Project not found", 404);
    
    // Only project owner or admin can delete (admin can delete any project)
    if (userRole !== 'admin' && existingProject.ownerId !== userId) {
      return sendError(res, "You can only delete your own projects", 403);
    }
    
    await ProjectModel.softDeleteProject(Number(id));
    return res.status(200).json({ success: true, status: 200, message: "Project deleted" });
  } catch (error) {
    console.error("Delete Project Error:", error);
    return res
      .status(500)
      .json({ success: false, status: 500, message: "Delete failed", error: error.message });
  }
};

// Apply to a project
const applyToProject = async (req, res) => {
  try {
    // Only use authenticated user's ID - no fallback to body for security
    const applicantId = req.user?.userId;
    const { projectId, matchScore, notes } = req.body;
    
    
    if (!applicantId || !projectId) {
      return sendError(res, "userId and projectId are required", 400);
    }
    
    const row = await ProjectModel.applyToProject({
      projectId: Number(projectId),
      userId: Number(applicantId),
      matchScore: matchScore ? String(matchScore) : null, // Convert to string for numeric field
      notes,
    });

    // Send email notifications after successful application
    try {
      // Get project information
      const project = await ProjectModel.getProjectById(Number(projectId));
      
      // Get developer information
      const developer = await getUserInfo(Number(applicantId));
      
      // Get project owner information
      const projectOwner = await getUserInfo(project?.ownerId);
      
      if (project?.title && developer?.email && developer?.name && projectOwner?.email && projectOwner?.name) {
        // Send confirmation email to developer
        await sendApplicationConfirmationEmail(
          developer.email,
          developer.name,
          project.title,
          projectOwner.name
        );
        
        // Send notification email to project owner
        await sendNewApplicationNotificationEmail(
          projectOwner.email,
          projectOwner.name,
          project.title,
          developer.name,
          developer.email
        );
      } else {
        console.log('Missing information for application emails:', {
          projectTitle: project?.title,
          developerEmail: developer?.email,
          developerName: developer?.name,
          ownerEmail: projectOwner?.email,
          ownerName: projectOwner?.name
        });
      }
    } catch (emailError) {
      console.error('Application email notifications failed:', emailError);
      // Don't fail the main request if emails fail
    }

    return res.status(201).json({ success: true, status: 201, message: "Applied successfully", application: row });
  } catch (error) {
    console.error("Apply Error:", error);
    return res
      .status(500)
      .json({ success: false, status: 500, message: "Apply failed", error: error.message });
  }
};

// Withdraw application
// Helper function to send application withdrawal notification email to project owner
const sendApplicationWithdrawalEmail = async (ownerEmail, ownerName, projectTitle, developerName, developerEmail) => {
  try {
    const emailBody = {
      from: process.env.EMAIL_USER,
      to: ownerEmail,
      subject: `📤 Application Withdrawn: "${projectTitle}"`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">📤 Application Withdrawn</h1>
          </div>
          <div style="padding: 30px; background: #f8f9fa; border-radius: 10px; margin-top: 20px;">
            <h2 style="color: #333; margin-top: 0;">Hello ${ownerName},</h2>
            <p style="color: #666; font-size: 16px; line-height: 1.6;">
              We wanted to inform you that <strong>${developerName}</strong> has withdrawn their application for your project <strong>"${projectTitle}"</strong>.
            </p>
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #6c757d;">
              <h3 style="color: #6c757d; margin-top: 0;">📋 Application Details</h3>
              <p style="color: #666; line-height: 1.6; margin: 0;">
                <strong>Developer:</strong> ${developerName}<br>
                <strong>Email:</strong> ${developerEmail}<br>
                <strong>Project:</strong> ${projectTitle}<br>
                <strong>Status:</strong> Withdrawn
              </p>
            </div>
            <div style="background: #d1ecf1; padding: 15px; border-radius: 8px; border-left: 4px solid #17a2b8; margin: 20px 0;">
              <h4 style="color: #0c5460; margin-top: 0;">💡 What This Means:</h4>
              <ul style="color: #0c5460; line-height: 1.6; margin: 0; padding-left: 20px;">
                <li>The developer is no longer interested in this project</li>
                <li>You can focus on other applicants</li>
                <li>Your project remains active for new applications</li>
                <li>Consider reaching out to other shortlisted candidates</li>
              </ul>
            </div>
            <p style="color: #666; font-size: 16px; line-height: 1.6;">
              Don't worry - there are many talented developers looking for great projects like yours!
            </p>
            <div style="text-align: center; margin-top: 30px;">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/projects"
                 style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; font-weight: bold;">
                View Other Applications
              </a>
            </div>
          </div>
          <div style="text-align: center; margin-top: 20px; color: #999; font-size: 14px;">
            <p>This email was sent from SkillBridge Pro</p>
          </div>
        </div>
      `
    };
    await sendMail(emailBody);
    console.log(`✅ Application withdrawal notification email sent to ${ownerEmail}`);
  } catch (error) {
    console.error('❌ Error sending application withdrawal email:', error);
  }
};

const withdrawApplication = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const { projectId } = req.body;
    if (!userId || !projectId) return sendError(res, "userId and projectId are required", 400);

    const row = await ProjectModel.withdrawApplication(Number(projectId), Number(userId));
    
    // Send email notification if application was actually withdrawn
    if (row) {
      try {
        const project = await ProjectModel.getProjectById(Number(projectId));
        const developer = await getUserInfo(Number(userId));
        const projectOwner = await getUserInfo(project?.ownerId);

        if (project?.title && developer?.email && developer?.name && projectOwner?.email && projectOwner?.name) {
          await sendApplicationWithdrawalEmail(
            projectOwner.email,
            projectOwner.name,
            project.title,
            developer.name,
            developer.email
          );
        } else {
          console.log('Missing information for withdrawal email:', {
            projectTitle: project?.title,
            developerEmail: developer?.email,
            developerName: developer?.name,
            ownerEmail: projectOwner?.email,
            ownerName: projectOwner?.name
          });
        }
      } catch (emailError) {
        console.error('Application withdrawal email notification failed:', emailError);
      }
    }
    
    // Make withdraw idempotent: return success even if nothing was deleted
    return res.status(200).json({
      success: true,
      status: 200,
      message: row ? "Application withdrawn" : "No existing application found; nothing to withdraw",
      application: row || null,
    });
  } catch (error) {
    console.error("Withdraw Error:", error);
    return res
      .status(500)
      .json({ success: false, status: 500, message: "Withdraw failed", error: error.message });
  }
};

// Update applicant status
const updateApplicantStatus = async (req, res) => {
  try {
    const { projectId, userId, status } = req.body;
    if (!projectId || !userId || !status) return sendError(res, "projectId, userId and status are required", 400);
    
    // Update the applicant status
    const row = await ProjectModel.updateApplicantStatus({
      projectId: Number(projectId),
      userId: Number(userId),
      status,
    });

    // Send email notification for shortlisted or rejected status
    if (status === 'shortlisted' || status === 'rejected') {
      try {
        // Get project information
        const project = await ProjectModel.getProjectById(Number(projectId));
        
        // Get user information
        const user = await getUserInfo(Number(userId));
        
        // Get project owner information
        const projectOwner = await getUserInfo(project?.ownerId);
        
        if (user?.email && project?.title && projectOwner?.name) {
          await sendApplicationStatusEmail(
            user.email,
            user.name || 'Developer',
            project.title,
            status,
            projectOwner.name
          );
        } else {
          console.log('Missing information for email notification:', {
            userEmail: user?.email,
            projectTitle: project?.title,
            projectOwnerName: projectOwner?.name
          });
        }
      } catch (emailError) {
        console.error('Email notification failed:', emailError);
        // Don't fail the main request if email fails
      }
    }

    return res.status(200).json({ success: true, status: 200, message: "Applicant status updated", application: row });
  } catch (error) {
    console.error("Update Applicant Status Error:", error);
    return res
      .status(500)
      .json({ success: false, status: 500, message: "Update failed", error: error.message });
  }
};

// List applicants
const listApplicants = async (req, res) => {
  try {
    const { projectId } = req.params;
    if (!projectId) return sendError(res, "projectId is required", 400);
    const rows = await ProjectModel.listApplicants(Number(projectId));
    return res.status(200).json({ success: true, status: 200, applicants: rows });
  } catch (error) {
    console.error("List Applicants Error:", error);
    return res
      .status(500)
      .json({ success: false, status: 500, message: "Failed to fetch applicants", error: error.message });
  }
};

// List applications for the authenticated developer
const listMyApplications = async (req, res) => {
  try {
    const userId = req.user?.userId;
    console.log('listMyApplications - userId:', userId);
    if (!userId) return sendError(res, "Authentication required", 401);
    const rows = await ProjectModel.listApplicationsByUser(Number(userId));
    console.log('listMyApplications - rows returned:', rows?.length, rows);
    return res.status(200).json({ success: true, status: 200, applications: rows });
  } catch (error) {
    console.error("List My Applications Error:", error);
    return res
      .status(500)
      .json({ success: false, status: 500, message: "Failed to fetch my applications", error: error.message });
  }
};

// Get count of applications for the authenticated developer
const getMyApplicationsCount = async (req, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return sendError(res, "Authentication required", 401);
    const count = await ProjectModel.countApplicationsByUser(Number(userId));
    return res.status(200).json({ success: true, status: 200, count });
  } catch (error) {
    console.error("Get My Applications Count Error:", error);
    return res
      .status(500)
      .json({ success: false, status: 500, message: "Failed to fetch applications count", error: error.message });
  }
};

// Get developer applied projects list
const getDeveloperAppliedProjects = async (req, res) => {
  try {
    const userId = req.user?.userId;
    console.log('getDeveloperAppliedProjects - req.user:', req.user);
    console.log('getDeveloperAppliedProjects - userId:', userId);
    if (!userId) return sendError(res, "Authentication required", 401);
    
    // Direct database query instead of using the model
    const { Pool } = require('pg');
    require('dotenv').config({ path: './.env' });
    
    const pool = new Pool({
      host: process.env.DB_HOST || '127.0.0.1',
      port: Number(process.env.DB_PORT) || 5432,
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'password',
      database: process.env.DB_NAME || 'skillbridge_db',
      ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
    });
    
    const client = await pool.connect();
    
    try {
      // Direct SQL query to get applied projects
      const result = await client.query(`
        SELECT 
          pa.id as "applicationId",
          pa.project_id as "projectId",
          pa.user_id as "userId",
          pa.status,
          pa.match_score as "matchScore",
          pa.rating,
          pa.notes,
          pa.applied_at as "appliedAt",
          pa.updated_at as "updatedAt",
          p.title as "projectTitle",
          p.description as "projectDescription",
          p.company as "projectCompany",
          p.status as "projectStatus",
          p.category as "projectCategory",
          p.experience_level as "projectExperienceLevel",
          p.budget_min as "projectBudgetMin",
          p.budget_max as "projectBudgetMax",
          p.currency as "projectCurrency",
          p.location as "projectLocation",
          p.is_remote as "projectIsRemote",
          p.duration as "projectDuration",
          p.start_date as "projectStartDate",
          p.deadline as "projectDeadline",
          p.owner_id as "projectOwnerId"
        FROM project_applicants pa
        LEFT JOIN projects p ON pa.project_id = p.id
        WHERE pa.user_id = $1 AND p.title IS NOT NULL
        ORDER BY pa.applied_at DESC
      `, [userId]);
      
      console.log('getDeveloperAppliedProjects - direct query result:', result.rows.length);
      
      // Transform the data
      const appliedProjects = result.rows.map(app => ({
        applicationId: app.applicationId,
        projectId: app.projectId,
        status: app.status,
        appliedAt: app.appliedAt,
        matchScore: app.matchScore,
        notes: app.notes,
        project: {
          id: app.projectId,
          title: app.projectTitle,
          description: app.projectDescription,
          company: app.projectCompany,
          category: app.projectCategory,
          experienceLevel: app.projectExperienceLevel,
          budgetMin: app.projectBudgetMin,
          budgetMax: app.projectBudgetMax,
          currency: app.projectCurrency,
          isRemote: app.projectIsRemote,
          location: app.projectLocation,
          duration: app.projectDuration,
          status: app.projectStatus,
          ownerId: app.projectOwnerId,
          startDate: app.projectStartDate,
          deadline: app.projectDeadline
        }
      }));
      
      console.log('getDeveloperAppliedProjects - transformed projects:', appliedProjects.length);
      
      await client.release();
      await pool.end();
      
      return res.status(200).json({ 
        success: true, 
        status: 200, 
        message: "Applied projects retrieved successfully",
        count: appliedProjects.length,
        appliedProjects 
      });
      
    } catch (dbError) {
      console.error('Database error:', dbError);
      await client.release();
      await pool.end();
      throw dbError;
    }
    
  } catch (error) {
    console.error("Get Developer Applied Projects Error:", error);
    return res
      .status(500)
      .json({ 
        success: false, 
        status: 500, 
        message: "Failed to fetch applied projects", 
        error: error.message 
      });
  }
};

// Create invite
const createInvite = async (req, res) => {
  try {
    const { projectId, invitedEmail, invitedUserId, role, message } = req.body;
    const inviterUserId = req.user?.userId;
    const inviterRole = req.user?.role;
    
    if (!projectId || !invitedEmail) return sendError(res, "projectId and invitedEmail are required", 400);
    if (!inviterUserId) return sendError(res, "Authentication required", 401);
    
    // Check if project exists and user has permission to invite
    const project = await ProjectModel.getProjectById(Number(projectId));
    if (!project) return sendError(res, "Project not found", 404);
    
    // Only project owner or admin can send invites
    if (inviterRole !== 'admin' && project.ownerId !== inviterUserId) {
      return sendError(res, "You can only invite people to your own projects", 403);
    }
    
    // Check if invite already exists for this email and project
    const existingInvites = await ProjectModel.getInvitesByProjectId(Number(projectId));
    const existingInvite = existingInvites.find(invite => 
      invite.invitedEmail.toLowerCase() === invitedEmail.toLowerCase() && 
      invite.status === 'pending'
    );
    
    if (existingInvite) {
      return sendError(res, "An active invite already exists for this email", 400);
    }
    
    const row = await ProjectModel.createInvite({
      projectId: Number(projectId),
      invitedEmail,
      invitedUserId: invitedUserId ? Number(invitedUserId) : null,
      role,
      message,
    });

    // Send email notification after successful invite creation
    try {
      // Get project owner information
      const projectOwner = await getUserInfo(Number(inviterUserId));
      
      // Get invited user information if userId is provided
      let invitedUser = null;
      if (invitedUserId) {
        invitedUser = await getUserInfo(Number(invitedUserId));
      }
      
      if (project?.title && projectOwner?.name) {
        // Send invite email to developer
        await sendDeveloperInviteEmail(
          invitedEmail,
          invitedUser?.name || null, // Use name if available, otherwise null
          project.title,
          projectOwner.name,
          role,
          message,
          row.id // Pass the invite ID for the link
        );
        
        console.log(`✅ Invite email sent to ${invitedEmail} for project: ${project.title}`);
      } else {
        console.log('Missing information for invite email:', {
          projectTitle: project?.title,
          ownerName: projectOwner?.name,
          invitedEmail
        });
      }
    } catch (emailError) {
      console.error('❌ Error sending invite email:', emailError);
      // Don't fail the invite creation if email fails
    }

    return res.status(201).json({ success: true, status: 201, message: "Invite created", invite: row });
  } catch (error) {
    console.error("Create Invite Error:", error);
    return res
      .status(500)
      .json({ success: false, status: 500, message: "Invite failed", error: error.message });
  }
};

// Get invites for the authenticated user (developer receives invites)
const getMyInvites = async (req, res) => {
  try {
    const userEmail = req.user?.email;
    if (!userEmail) return sendError(res, "Authentication required", 401);
    
    const invites = await ProjectModel.getInvitesByEmail(userEmail);
    return res.status(200).json({ success: true, status: 200, invites });
  } catch (error) {
    console.error("Get My Invites Error:", error);
    return res
      .status(500)
      .json({ success: false, status: 500, message: "Failed to fetch invites", error: error.message });
  }
};

// Get invites sent by project owner
const getSentInvitations = async (req, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return sendError(res, "Authentication required", 401);
    
    const invites = await ProjectModel.getInvitesByProjectOwner(userId);
    return res.status(200).json({ 
      success: true, 
      status: 200, 
      invites,
      count: invites.length 
    });
  } catch (error) {
    console.error("Get Sent Invitations Error:", error);
    return res
      .status(500)
      .json({ success: false, status: 500, message: "Failed to fetch sent invitations", error: error.message });
  }
};

// Cancel/Delete invite (project owner only)
const cancelInvite = async (req, res) => {
  try {
    console.log("cancelInvite - Request body:", JSON.stringify(req.body, null, 2));
    const { inviteId, projectId, developerId } = req.body;
    console.log("cancelInvite - Extracted values:", { inviteId, projectId, developerId });
    const userId = req.user?.userId;
    const userRole = req.user?.role;
    
    if (!userId) return sendError(res, "Authentication required", 401);
    
    let invite;
    
    // If inviteId is provided, use it directly
    if (inviteId) {
      const inviteIdNum = Number(inviteId);
      if (!inviteIdNum || isNaN(inviteIdNum)) {
        return sendError(res, "Invalid inviteId", 400);
      }
      
      invite = await ProjectModel.getInviteById(inviteIdNum);
      if (!invite) return sendError(res, "Invite not found", 404);
      
      // Log the invite structure for debugging BEFORE any modifications
      console.log("Invite from getInviteById (raw):", {
        inviteId: inviteIdNum,
        requestProjectId: projectId,
        invite: {
          id: invite.id,
          projectId: invite.projectId,
          project_id: invite.project_id,
          allKeys: Object.keys(invite),
          fullInvite: JSON.stringify(invite, null, 2)
        }
      });
    } 
    // Otherwise, find invite by projectId and developerId
    else if (projectId && developerId) {
      const invites = await ProjectModel.getInvitesByProjectIdAndUserId(
        Number(projectId),
        Number(developerId)
      );
      invite = invites.find(inv => inv.status === 'pending') || invites[0];
      if (!invite) return sendError(res, "Invite not found", 404);
    } else {
      return sendError(res, "inviteId or (projectId and developerId) required", 400);
    }
    
    // Check if project exists and user has permission
    // Priority: 1. Request body projectId (most reliable), 2. Invite object projectId, 3. Invite object project_id
    // Handle both camelCase (from Drizzle) and snake_case (from raw SQL) field names
    let inviteProjectIdRaw = null;
    let projectIdSource = 'unknown';
    
    console.log("Evaluating projectId sources:", {
      requestProjectId: projectId,
      requestProjectIdType: typeof projectId,
      requestProjectIdNumber: Number(projectId),
      inviteProjectId: invite.projectId,
      inviteProjectIdType: typeof invite.projectId,
      inviteProject_id: invite.project_id,
      inviteProject_idType: typeof invite.project_id
    });
    
    // Validate and use projectId from request body (most reliable when provided)
    // Check request body projectId FIRST since user is explicitly sending it
    if (projectId !== undefined && projectId !== null && projectId !== '') {
      const requestProjectIdNum = Number(projectId);
      if (!isNaN(requestProjectIdNum) && requestProjectIdNum > 0 && Number.isInteger(requestProjectIdNum)) {
        inviteProjectIdRaw = requestProjectIdNum;
        projectIdSource = 'request.body';
        console.log("✅ Using projectId from request body:", requestProjectIdNum);
      } else {
        console.warn("⚠️ Request projectId is invalid:", { projectId, converted: requestProjectIdNum });
      }
    }
    
    // Fallback to invite.projectId only if request body didn't provide valid projectId
    if (!inviteProjectIdRaw && invite.projectId !== undefined && invite.projectId !== null) {
      const inviteProjectIdNum = Number(invite.projectId);
      if (!isNaN(inviteProjectIdNum) && inviteProjectIdNum > 0 && Number.isInteger(inviteProjectIdNum)) {
        inviteProjectIdRaw = inviteProjectIdNum;
        projectIdSource = 'invite.projectId';
        console.log("✅ Using projectId from invite.projectId:", inviteProjectIdNum);
      }
    }
    
    // Fallback to invite.project_id as last resort
    if (!inviteProjectIdRaw && invite.project_id !== undefined && invite.project_id !== null) {
      const inviteProjectIdNum = Number(invite.project_id);
      if (!isNaN(inviteProjectIdNum) && inviteProjectIdNum > 0 && Number.isInteger(inviteProjectIdNum)) {
        inviteProjectIdRaw = inviteProjectIdNum;
        projectIdSource = 'invite.project_id';
        console.log("✅ Using projectId from invite.project_id:", inviteProjectIdNum);
      }
    }
    
    // Final validation - ensure we have a valid projectId before proceeding
    if (!inviteProjectIdRaw || inviteProjectIdRaw === null || inviteProjectIdRaw === undefined) {
      console.error("No project ID found in any source:", {
        inviteId: inviteId,
        requestBody: req.body,
        requestProjectId: projectId,
        invite: {
          id: invite?.id,
          projectId: invite?.projectId,
          project_id: invite?.project_id,
          allFields: invite ? Object.keys(invite) : [],
          fullInvite: invite ? JSON.stringify(invite, null, 2) : 'no invite'
        }
      });
      return sendError(res, `No valid project ID found. Invite ID: ${invite?.id}, Request Project ID: ${projectId}`, 400);
    }
    
    const inviteProjectId = Number(inviteProjectIdRaw);
    
    if (isNaN(inviteProjectId) || inviteProjectId <= 0 || !Number.isInteger(inviteProjectId)) {
      console.error("Invalid project ID value (NaN or invalid):", {
        inviteId: inviteId,
        requestBody: req.body,
        requestProjectId: projectId,
        inviteProjectIdRaw: inviteProjectIdRaw,
        inviteProjectId: inviteProjectId,
        invite: {
          id: invite?.id,
          projectId: invite?.projectId,
          project_id: invite?.project_id
        }
      });
      return sendError(res, `Invalid project ID value: ${inviteProjectIdRaw}. Must be a positive integer.`, 400);
    }
    
    console.log("Using project ID for invite cancellation:", {
      inviteId: invite?.id,
      inviteProjectId: inviteProjectId,
      source: projectIdSource,
      inviteProjectIdRaw: inviteProjectIdRaw
    });
    
    // Double-check before calling getProjectById - should never be NaN at this point
    if (isNaN(inviteProjectId) || inviteProjectId <= 0) {
      console.error("CRITICAL: projectId is still invalid right before getProjectById call!");
      return sendError(res, `Critical error: Invalid project ID ${inviteProjectId}`, 500);
    }
    
    const project = await ProjectModel.getProjectById(inviteProjectId);
    if (!project) return sendError(res, "Project not found", 404);
    
    // Only project owner or admin can cancel invites
    if (userRole !== 'admin' && project.ownerId !== userId) {
      return sendError(res, "You can only cancel invites for your own projects", 403);
    }
    
    // Delete the invite
    const deleted = await ProjectModel.deleteInvite(invite.id);
    
    if (!deleted) {
      return sendError(res, "Failed to cancel invite", 500);
    }
    
    return res.status(200).json({ 
      success: true, 
      status: 200, 
      message: "Invite canceled successfully",
      invite: deleted 
    });
  } catch (error) {
    console.error("Cancel Invite Error:", error);
    return res.status(500).json({ 
      success: false, 
      status: 500, 
      message: "Failed to cancel invite", 
      error: error.message 
    });
  }
};

// Respond to invite
const respondInvite = async (req, res) => {
  try {
    const { inviteId, status } = req.body;
    const responderUserId = req.user?.userId;
    const responderEmail = req.user?.email;
    
    if (!inviteId || !status) return sendError(res, "inviteId and status are required", 400);
    if (!responderUserId || !responderEmail) return sendError(res, "Authentication required", 401);
    
    // Get the invite to validate the responder
    const invite = await ProjectModel.getInviteById(Number(inviteId));
    if (!invite) return sendError(res, "Invite not found", 404);
    
    // Check if the person responding is actually the invited person
    const isInvitedUser = invite.invitedUserId === responderUserId || 
                          invite.invitedEmail.toLowerCase() === responderEmail.toLowerCase();
    
    if (!isInvitedUser) {
      return sendError(res, "You can only respond to invites sent to you", 403);
    }
    
    // Check if invite is still pending
    if (invite.status !== 'pending') {
      return sendError(res, `This invite has already been ${invite.status}`, 400);
    }
    
    const row = await ProjectModel.respondInvite({ inviteId: Number(inviteId), status });
    
    // Send email notification to project owner about invite response
    try {
      // Get project information
      const project = await ProjectModel.getProjectById(Number(invite.projectId));
      
      // Get project owner information
      const projectOwner = await getUserInfo(Number(project?.ownerId));
      
      // Get responder information
      const responder = await getUserInfo(Number(responderUserId));
      
      if (project?.title && projectOwner?.email && projectOwner?.name && responder?.name) {
        // Send notification email to project owner about the response
        await sendInviteResponseNotificationEmail(
          projectOwner.email,
          projectOwner.name,
          project.title,
          responder.name,
          responder.email,
          status
        );
        
        console.log(`✅ Invite response notification sent to ${projectOwner.email} for project: ${project.title}`);
      } else {
        console.log('Missing information for invite response email:', {
          projectTitle: project?.title,
          ownerEmail: projectOwner?.email,
          ownerName: projectOwner?.name,
          responderName: responder?.name,
          responderEmail: responder?.email
        });
      }
    } catch (emailError) {
      console.error('❌ Error sending invite response notification email:', emailError);
      // Don't fail the response if email fails
    }
    
    return res.status(200).json({ success: true, status: 200, message: "Invite updated", invite: row });
  } catch (error) {
    console.error("Respond Invite Error:", error);
    return res
      .status(500)
      .json({ success: false, status: 500, message: "Failed to update invite", error: error.message });
  }
};

// Add file
const addFile = async (req, res) => {
  try {
    const { projectId, description, category } = req.body;
    const uploaderId = req.user?.userId;
    
    if (!projectId || !uploaderId) {
      return sendError(res, "projectId and uploaderId are required", 400);
    }

    // Check if file was uploaded
    if (!req.files || !req.files.file) {
      return sendError(res, "No file uploaded", 400);
    }

    const file = req.files.file;
    const fileName = file.name;
    const fileSize = file.size;
    const mimeType = file.mimetype;
    
    // Upload file to Supabase (mirror user service logic)
    const fileUpload = await uploadFileToSupabase(
      file,
      "project-files" // Storage path for project files
    );
    
    const row = await ProjectModel.addFile({
      projectId: Number(projectId),
      uploaderId: Number(uploaderId),
      name: fileName,
      url: fileUpload.path, // Store only the Supabase path (like user service)
      mimeType,
      sizeKb: Math.round(fileSize / 1024),
      description: description || null,
      category: category || 'other'
    });
    
    return res.status(201).json({ 
      success: true, 
      status: 201, 
      message: "File uploaded successfully", 
      file: row
    });
  } catch (error) {
    console.error("Add File Error:", error);
    return res
      .status(500)
      .json({ success: false, status: 500, message: "Failed to upload file to Supabase", error: error.message });
  }
};

// Get files by project ID
const getProjectFiles = async (req, res) => {
  try {
    const { projectId } = req.params;
    if (!projectId) return sendError(res, "projectId is required", 400);
    
    const files = await ProjectModel.getFilesByProjectId(Number(projectId));
    
    // Generate signed URLs for each file (mirror user service logic)
    const filesWithUrls = await Promise.all(files.map(async (file) => {
      let signedUrl = null;
      
      // Generate signed URL if file.url is a path (not already a full URL)
      if (file.url && !file.url.startsWith('http')) {
        const { data, error } = await supabase.storage
          .from("upload")
          .createSignedUrl(file.url, 60 * 60); // 1 hour expiry (like user service)
        
        if (!error) {
          signedUrl = data.signedUrl;
        }
      } else if (file.url && file.url.startsWith('http')) {
        // If it's already a full URL, use it as is
        signedUrl = file.url;
      }
      
      return {
        ...file,
        signedUrl: signedUrl
      };
    }));
    
    return res.status(200).json({ 
      success: true, 
      status: 200, 
      files: filesWithUrls 
    });
  } catch (error) {
    console.error("Get Project Files Error:", error);
    return res
      .status(500)
      .json({ success: false, status: 500, message: "Failed to fetch project files", error: error.message });
  }
};

// Add update
const addUpdate = async (req, res) => {
  try {
    const authorId = req.user?.userId;
    const { projectId, type, message } = req.body;
    if (!authorId || !projectId || !message) return sendError(res, "authorId, projectId and message are required", 400);
    const row = await ProjectModel.addUpdate({ projectId: Number(projectId), authorId: Number(authorId), type, message });
    return res.status(201).json({ success: true, status: 201, message: "Update added", update: row });
  } catch (error) {
    console.error("Add Update Error:", error);
    return res
      .status(500)
      .json({ success: false, status: 500, message: "Failed to add update", error: error.message });
  }
};

// Add review
const addReview = async (req, res) => {
  try {
    const reviewerId = req.user?.userId;
    const { projectId, rating, comment } = req.body;
    if (!reviewerId || !projectId || !rating) return sendError(res, "reviewerId, projectId and rating are required", 400);
    const row = await ProjectModel.addReview({ projectId: Number(projectId), reviewerId: Number(reviewerId), rating: Number(rating), comment });
    return res.status(201).json({ success: true, status: 201, message: "Review added", review: row });
  } catch (error) {
    console.error("Add Review Error:", error);
    return res
      .status(500)
      .json({ success: false, status: 500, message: "Failed to add review", error: error.message });
  }
};

// Add boost
const addBoost = async (req, res) => {
  try {
    const purchaserId = req.user?.userId;
    const { projectId, plan, amountCents, currency, startAt, endAt } = req.body;
    if (!purchaserId || !projectId || !plan || !amountCents || !startAt || !endAt) {
      return sendError(res, "purchasedBy, projectId, plan, amountCents, startAt, endAt are required", 400);
    }
    const row = await ProjectModel.addBoost({
      projectId: Number(projectId),
      purchasedBy: Number(purchaserId),
      plan,
      amountCents: Number(amountCents),
      currency,
      startAt: new Date(startAt),
      endAt: new Date(endAt),
    });
    return res.status(201).json({ success: true, status: 201, message: "Boost added", boost: row });
  } catch (error) {
    console.error("Add Boost Error:", error);
    return res
      .status(500)
      .json({ success: false, status: 500, message: "Failed to add boost", error: error.message });
  }
};

// Get project updates
const getProjectUpdates = async (req, res) => {
  try {
    const { projectId } = req.params;
    if (!projectId) return sendError(res, "projectId is required", 400);
    
    const updates = await ProjectModel.getProjectUpdates(Number(projectId));
    return res.status(200).json({ success: true, status: 200, updates });
  } catch (error) {
    console.error("Get Project Updates Error:", error);
    return res
      .status(500)
      .json({ success: false, status: 500, message: "Failed to fetch project updates", error: error.message });
  }
};

// Get project reviews
const getProjectReviews = async (req, res) => {
  try {
    const { projectId } = req.params;
    if (!projectId) return sendError(res, "projectId is required", 400);
    
    const reviews = await ProjectModel.getProjectReviews(Number(projectId));
    return res.status(200).json({ success: true, status: 200, reviews });
  } catch (error) {
    console.error("Get Project Reviews Error:", error);
    return res
      .status(500)
      .json({ success: false, status: 500, message: "Failed to fetch project reviews", error: error.message });
  }
};

// Get project boosts
const getProjectBoosts = async (req, res) => {
  try {
    const { projectId } = req.params;
    if (!projectId) return sendError(res, "projectId is required", 400);
    
    const boosts = await ProjectModel.getProjectBoosts(Number(projectId));
    return res.status(200).json({ success: true, status: 200, boosts });
  } catch (error) {
    console.error("Get Project Boosts Error:", error);
    return res
      .status(500)
      .json({ success: false, status: 500, message: "Failed to fetch project boosts", error: error.message });
  }
};

// Get project statistics
const getProjectStats = async (req, res) => {
  try {
    const { projectId } = req.params;
    if (!projectId) return sendError(res, "projectId is required", 400);
    
    const stats = await ProjectModel.getProjectStats(Number(projectId));
    return res.status(200).json({ success: true, status: 200, stats });
  } catch (error) {
    console.error("Get Project Stats Error:", error);
    return res
      .status(500)
      .json({ success: false, status: 500, message: "Failed to fetch project stats", error: error.message });
  }
};

// Search projects with advanced filters
const searchProjects = async (req, res) => {
  try {
    const {
      query,
      category,
      status,
      priority,
      experienceLevel,
      budgetMin,
      budgetMax,
      isRemote,
      location,
      sortBy,
      sortOrder,
      page = 1,
      limit = 20
    } = req.query;
    
    const filters = {
      query,
      category,
      status,
      priority,
      experienceLevel,
      budgetMin: budgetMin ? Number(budgetMin) : undefined,
      budgetMax: budgetMax ? Number(budgetMax) : undefined,
      isRemote: isRemote === 'true',
      location,
      sortBy: sortBy || 'createdAt',
      sortOrder: sortOrder || 'desc',
      page: Number(page),
      limit: Number(limit)
    };
    
    const results = await ProjectModel.searchProjects(filters);
    return res.status(200).json({ success: true, status: 200, ...results });
  } catch (error) {
    console.error("Search Projects Error:", error);
    return res
      .status(500)
      .json({ success: false, status: 500, message: "Failed to search projects", error: error.message });
  }
};

// Get project recommendations for user
const getProjectRecommendations = async (req, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return sendError(res, "Authentication required", 401);
    
    const { limit = 10 } = req.query;
    const recommendations = await ProjectModel.getProjectRecommendations(Number(userId), Number(limit));
    return res.status(200).json({ success: true, status: 200, recommendations });
  } catch (error) {
    console.error("Get Project Recommendations Error:", error);
    return res
      .status(500)
      .json({ success: false, status: 500, message: "Failed to fetch recommendations", error: error.message });
  }
};

// Add project to favorites
const addProjectFavorite = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const { projectId } = req.body;
    
    if (!userId || !projectId) {
      return sendError(res, "userId and projectId are required", 400);
    }
    
    const projectIdNum = Number(projectId);
    if (isNaN(projectIdNum) || projectIdNum <= 0) {
      return sendError(res, "Invalid project id", 400);
    }
    
    const favorite = await ProjectModel.addProjectFavorite(Number(userId), projectIdNum);
    return res.status(201).json({ success: true, status: 201, message: "Project added to favorites", favorite });
  } catch (error) {
    console.error("Add Project Favorite Error:", error);
    return res
      .status(500)
      .json({ success: false, status: 500, message: "Failed to add favorite", error: error.message });
  }
};

// Remove project from favorites
const removeProjectFavorite = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const { projectId } = req.body;
    
    if (!userId || !projectId) {
      return sendError(res, "userId and projectId are required", 400);
    }
    
    const projectIdNum = Number(projectId);
    if (isNaN(projectIdNum) || projectIdNum <= 0) {
      return sendError(res, "Invalid project id", 400);
    }
    
    await ProjectModel.removeProjectFavorite(Number(userId), projectIdNum);
    return res.status(200).json({ success: true, status: 200, message: "Project removed from favorites" });
  } catch (error) {
    console.error("Remove Project Favorite Error:", error);
    return res
      .status(500)
      .json({ success: false, status: 500, message: "Failed to remove favorite", error: error.message });
  }
};

// Get user's favorite projects
const getProjectFavorites = async (req, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return sendError(res, "Authentication required", 401);
    
    const favorites = await ProjectModel.getProjectFavorites(Number(userId));
    return res.status(200).json({ success: true, status: 200, favorites });
  } catch (error) {
    console.error("Get Project Favorites Error:", error);
    return res
      .status(500)
      .json({ success: false, status: 500, message: "Failed to fetch favorites", error: error.message });
  }
};

// 🔖 Project Saves (Bookmarks)
const addProjectSave = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const { projectId } = req.body;
    if (!userId || !projectId) return sendError(res, "userId and projectId are required", 400);
    const save = await ProjectModel.addProjectSave(Number(userId), Number(projectId));
    return res.status(201).json({ success: true, status: 201, message: "Project saved", save });
  } catch (error) {
    console.error("Add Project Save Error:", error);
    return res.status(500).json({ success: false, status: 500, message: "Failed to save project", error: error.message });
  }
};

const removeProjectSave = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const { projectId } = req.body;
    if (!userId || !projectId) return sendError(res, "userId and projectId are required", 400);
    await ProjectModel.removeProjectSave(Number(userId), Number(projectId));
    return res.status(200).json({ success: true, status: 200, message: "Project unsaved" });
  } catch (error) {
    console.error("Remove Project Save Error:", error);
    return res.status(500).json({ success: false, status: 500, message: "Failed to unsave project", error: error.message });
  }
};

const getProjectSaves = async (req, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return sendError(res, "Authentication required", 401);
    const saves = await ProjectModel.getProjectSaves(Number(userId));
    return res.status(200).json({ success: true, status: 200, saves });
  } catch (error) {
    console.error("Get Project Saves Error:", error);
    return res.status(500).json({ success: false, status: 500, message: "Failed to fetch saves", error: error.message });
  }
};

// Add project comment
const addProjectComment = async (req, res) => {
  try {
    const authorId = req.user?.userId;
    const { projectId, content, parentCommentId } = req.body;
    
    if (!authorId || !projectId || !content) {
      return sendError(res, "authorId, projectId and content are required", 400);
    }
    
    const comment = await ProjectModel.addProjectComment({
      projectId: Number(projectId),
      authorId: Number(authorId),
      content,
      parentCommentId: parentCommentId ? Number(parentCommentId) : null
    });
    
    return res.status(201).json({ success: true, status: 201, message: "Comment added", comment });
  } catch (error) {
    console.error("Add Project Comment Error:", error);
    return res
      .status(500)
      .json({ success: false, status: 500, message: "Failed to add comment", error: error.message });
  }
};

// Get project comments
const getProjectComments = async (req, res) => {
  try {
    const { projectId } = req.params;
    if (!projectId) return sendError(res, "projectId is required", 400);
    
    const comments = await ProjectModel.getProjectComments(Number(projectId));
    return res.status(200).json({ success: true, status: 200, comments });
  } catch (error) {
    console.error("Get Project Comments Error:", error);
    return res
      .status(500)
      .json({ success: false, status: 500, message: "Failed to fetch comments", error: error.message });
  }
};

// Update project comment
const updateProjectComment = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const { commentId } = req.params;
    const { content } = req.body;
    
    if (!userId || !commentId || !content) {
      return sendError(res, "userId, commentId and content are required", 400);
    }
    
    const comment = await ProjectModel.updateProjectComment(Number(commentId), Number(userId), content);
    if (!comment) return sendError(res, "Comment not found or you don't have permission to edit it", 404);
    
    return res.status(200).json({ success: true, status: 200, message: "Comment updated", comment });
  } catch (error) {
    console.error("Update Project Comment Error:", error);
    return res
      .status(500)
      .json({ success: false, status: 500, message: "Failed to update comment", error: error.message });
  }
};

// Delete project comment
const deleteProjectComment = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const { commentId } = req.params;
    
    if (!userId || !commentId) {
      return sendError(res, "userId and commentId are required", 400);
    }
    
    const deleted = await ProjectModel.deleteProjectComment(Number(commentId), Number(userId));
    if (!deleted) return sendError(res, "Comment not found or you don't have permission to delete it", 404);
    
    return res.status(200).json({ success: true, status: 200, message: "Comment deleted" });
  } catch (error) {
    console.error("Delete Project Comment Error:", error);
    return res
      .status(500)
      .json({ success: false, status: 500, message: "Failed to delete comment", error: error.message });
  }
};

// Get all skills and tags (for dropdowns, filters, etc.)
const getGlobalSkillsAndTags = async (req, res) => {
  try {
    const { ProjectSkillsModel } = require('../models/project-skills.model');
    const { ProjectTagsModel } = require('../models/project-tags.model');

    // Get all skills from reference table
    const skills = await ProjectSkillsModel.getAllSkills();

    // Get all tags from reference table
    const tags = await ProjectTagsModel.getAllTags();

    return res.status(200).json({
      success: true,
      status: 200,
      data: {
        skills: skills.map(skill => ({
          id: skill.id,
          name: skill.name,
          category: skill.category
        })),
        tags: tags.map(tag => ({
          id: tag.id,
          name: tag.name,
          category: tag.category
        }))
      }
    });
  } catch (error) {
    console.error("Get Skills and Tags Error:", error);
    return res
      .status(500)
      .json({ success: false, status: 500, message: "Failed to get skills and tags", error: error.message });
  }
};

// Get search suggestions for skills and tags
const getSearchSuggestions = async (req, res) => {
  try {
    const { query, type = 'all' } = req.query; // type can be 'skills', 'tags', or 'all'
    
    if (!query || query.trim().length < 2) {
      return res.status(200).json({ 
        success: true, 
        status: 200, 
        suggestions: { skills: [], tags: [] }
      });
    }

    const searchTerm = query.trim().toLowerCase();
    const suggestions = { skills: [], tags: [] };

    // Get skills suggestions from reference table
    if (type === 'all' || type === 'skills') {
      const { ProjectSkillsModel } = require('../models/project-skills.model');
      const skillsResult = await ProjectSkillsModel.searchSkills(searchTerm);
      suggestions.skills = skillsResult.map(row => row.name);
    }

    // Get tags suggestions from reference table
    if (type === 'all' || type === 'tags') {
      const { ProjectTagsModel } = require('../models/project-tags.model');
      const tagsResult = await ProjectTagsModel.searchTags(searchTerm);
      suggestions.tags = tagsResult.map(row => row.name);
    }

    return res.status(200).json({ 
      success: true, 
      status: 200, 
      suggestions 
    });
  } catch (error) {
    console.error("Get Search Suggestions Error:", error);
    return res
      .status(500)
      .json({ success: false, status: 500, message: "Failed to get search suggestions", error: error.message });
  }
};

// Generate PDF report for applicants
const generateApplicantsReport = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const { 
      projectId, 
      exportType = 'complete-data',
      format = 'pdf',
      includeApplicants = true,
      includeInvites = true,
      includeTeamMembers = true,
      includeFiles = false,
      includeUpdates = false
    } = req.body;
    
    if (!userId) {
      return res.status(401).json({ 
        success: false, 
        status: 401, 
        message: "User not authenticated" 
      });
    }

    // Get specific project or all user projects
    let projects;
    if (projectId) {
      const project = await ProjectModel.getProject(projectId);
      if (!project || project.ownerId !== userId) {
        return res.status(404).json({
          success: false,
          status: 404,
          message: "Project not found or access denied"
        });
      }
      projects = [project];
    } else {
      projects = await ProjectModel.listProjects({ ownerId: userId });
    }
    
    if (!projects || projects.length === 0) {
      return res.status(404).json({
        success: false,
        status: 404,
        message: "No projects found for this user"
      });
    }

    // Prepare export data
    const exportData = {
      exportInfo: {
        exportedAt: new Date().toISOString(),
        exportedBy: req.user.email,
        exportType,
        projectId: projectId || 'all',
        format
      },
      projectDetails: projects.map(project => ({
        id: project.id,
        title: project.title,
        description: project.description,
        status: project.status,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
        budget: project.budget,
        timeline: project.timeline
      }))
    };

    // Include applicants data if requested
    if (includeApplicants) {
      exportData.allApplicants = [];
      for (const project of projects) {
        const applicants = await ProjectModel.listApplicants(project.id);
        exportData.allApplicants.push(...applicants.map(app => ({
          ...app,
          projectTitle: project.title,
          projectId: project.id
        })));
      }
    }

    // Include invites data if requested
    if (includeInvites) {
      exportData.allInvites = [];
      for (const project of projects) {
        // Get invites for this project (you may need to implement this method)
        // const invites = await ProjectModel.getProjectInvites(project.id);
        // exportData.allInvites.push(...invites);
      }
    }

    // Include team members if requested
    if (includeTeamMembers) {
      exportData.teamMembers = [];
      // Get team members for projects
    }

    // Include project files if requested
    if (includeFiles) {
      exportData.projectFiles = [];
      for (const project of projects) {
        const files = await ProjectModel.getProjectFiles(project.id);
        exportData.projectFiles.push(...files);
      }
    }

    // Include project updates if requested
    if (includeUpdates) {
      exportData.projectUpdates = [];
      for (const project of projects) {
        const updates = await ProjectModel.getProjectUpdates(project.id);
        exportData.projectUpdates.push(...updates);
      }
    }

    // Always include statistics
    exportData.statistics = {
      totalProjects: projects.length,
      totalApplicants: exportData.allApplicants?.length || 0,
      appliedCount: exportData.allApplicants?.filter(app => app.status === 'applied').length || 0,
      shortlistedCount: exportData.allApplicants?.filter(app => app.status === 'shortlisted').length || 0,
      rejectedCount: exportData.allApplicants?.filter(app => app.status === 'rejected').length || 0,
      acceptedCount: exportData.allApplicants?.filter(app => app.status === 'accepted').length || 0
    };

    if (format === 'json') {
      return res.status(200).json({
        success: true,
        status: 200,
        data: JSON.stringify(exportData, null, 2),
        message: "JSON export generated successfully"
      });
    }

    // For PDF format, generate HTML report
    const htmlReport = generateHTMLReport(projects, {}, exportData.allApplicants || []);
    return res.status(200).json({
      success: true,
      status: 200,
      data: htmlReport,
      message: "HTML report generated for PDF conversion"
    });

  } catch (error) {
    console.error("Generate Report Error:", error);
    return res.status(500).json({
      success: false,
      status: 500,
      message: "Failed to generate report",
      error: error.message
    });
  }
};

// Helper function to generate HTML report
const generateHTMLReport = (projects, projectApplicantsMap, allApplicants) => {
  const currentDate = new Date().toLocaleDateString();
  
  // Calculate statistics
  const stats = {
    totalProjects: projects.length,
    totalApplicants: allApplicants.length,
    appliedCount: allApplicants.filter(app => app.status === 'applied').length,
    shortlistedCount: allApplicants.filter(app => app.status === 'shortlisted').length,
    rejectedCount: allApplicants.filter(app => app.status === 'rejected').length,
    acceptedCount: allApplicants.filter(app => app.status === 'accepted').length
  };

  let html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>SkillBridge Pro - Applicants Report</title>
        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
                line-height: 1.6; 
                color: #333; 
                background: #f8f9fa;
                padding: 20px;
            }
            .container { 
                max-width: 1200px; 
                margin: 0 auto; 
                background: white; 
                padding: 30px; 
                border-radius: 10px; 
                box-shadow: 0 0 20px rgba(0,0,0,0.1);
            }
            .header { 
                text-align: center; 
                margin-bottom: 40px; 
                padding-bottom: 20px; 
                border-bottom: 3px solid #667eea;
            }
            .header h1 { 
                color: #667eea; 
                font-size: 2.5em; 
                margin-bottom: 10px;
            }
            .header p { 
                color: #666; 
                font-size: 1.1em;
            }
            .stats-grid { 
                display: grid; 
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); 
                gap: 20px; 
                margin-bottom: 40px;
            }
            .stat-card { 
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                color: white; 
                padding: 20px; 
                border-radius: 10px; 
                text-align: center;
            }
            .stat-card h3 { 
                font-size: 2em; 
                margin-bottom: 5px;
            }
            .stat-card p { 
                opacity: 0.9;
            }
            .section { 
                margin-bottom: 40px;
            }
            .section h2 { 
                color: #333; 
                margin-bottom: 20px; 
                padding-bottom: 10px; 
                border-bottom: 2px solid #eee;
            }
            .project-card { 
                background: #f8f9fa; 
                border: 1px solid #dee2e6; 
                border-radius: 8px; 
                padding: 20px; 
                margin-bottom: 20px;
            }
            .project-title { 
                color: #667eea; 
                font-size: 1.3em; 
                margin-bottom: 15px;
            }
            .applicant-table { 
                width: 100%; 
                border-collapse: collapse; 
                margin-top: 15px;
            }
            .applicant-table th, .applicant-table td { 
                padding: 12px; 
                text-align: left; 
                border-bottom: 1px solid #dee2e6;
            }
            .applicant-table th { 
                background: #667eea; 
                color: white; 
                font-weight: 600;
            }
            .applicant-table tr:nth-child(even) { 
                background: #f8f9fa;
            }
            .status-badge { 
                padding: 4px 12px; 
                border-radius: 20px; 
                font-size: 0.8em; 
                font-weight: 600; 
                text-transform: uppercase;
            }
            .status-applied { background: #e3f2fd; color: #1976d2; }
            .status-shortlisted { background: #e8f5e8; color: #2e7d32; }
            .status-rejected { background: #ffebee; color: #c62828; }
            .status-accepted { background: #f3e5f5; color: #7b1fa2; }
            .skills { 
                display: flex; 
                flex-wrap: wrap; 
                gap: 5px;
            }
            .skill-tag { 
                background: #667eea; 
                color: white; 
                padding: 2px 8px; 
                border-radius: 12px; 
                font-size: 0.7em;
            }
            .footer { 
                text-align: center; 
                margin-top: 40px; 
                padding-top: 20px; 
                border-top: 2px solid #eee; 
                color: #666;
            }
            @media print {
                body { background: white; }
                .container { box-shadow: none; }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>📊 SkillBridge Pro - Applicants Report</h1>
                <p>Generated on ${currentDate}</p>
            </div>

            <div class="stats-grid">
                <div class="stat-card">
                    <h3>${stats.totalProjects}</h3>
                    <p>Total Projects</p>
                </div>
                <div class="stat-card">
                    <h3>${stats.totalApplicants}</h3>
                    <p>Total Applicants</p>
                </div>
                <div class="stat-card">
                    <h3>${stats.appliedCount}</h3>
                    <p>Applied</p>
                </div>
                <div class="stat-card">
                    <h3>${stats.shortlistedCount}</h3>
                    <p>Shortlisted</p>
                </div>
                <div class="stat-card">
                    <h3>${stats.rejectedCount}</h3>
                    <p>Rejected</p>
                </div>
                <div class="stat-card">
                    <h3>${stats.acceptedCount}</h3>
                    <p>Accepted</p>
                </div>
            </div>

            <div class="section">
                <h2>📋 Project-wise Applicants</h2>
  `;

  // Add project-wise applicants
  projects.forEach(project => {
    const applicants = projectApplicantsMap[project.id] || [];
    
    html += `
      <div class="project-card">
        <div class="project-title">${project.title}</div>
        <p><strong>Description:</strong> ${project.description || 'No description'}</p>
        <p><strong>Total Applicants:</strong> ${applicants.length}</p>
        
        ${applicants.length > 0 ? `
          <table class="applicant-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Status</th>
                <th>Experience</th>
                <th>Location</th>
                <th>Skills</th>
                <th>Applied Date</th>
              </tr>
            </thead>
            <tbody>
              ${applicants.map(applicant => `
                <tr>
                  <td><strong>${applicant.name || 'N/A'}</strong></td>
                  <td>${applicant.email || 'N/A'}</td>
                  <td>
                    <span class="status-badge status-${applicant.status}">
                      ${applicant.status || 'applied'}
                    </span>
                  </td>
                  <td>${applicant.experience || 'N/A'}</td>
                  <td>${applicant.location || 'N/A'}</td>
                  <td>
                    <div class="skills">
                      ${applicant.skills ? JSON.parse(applicant.skills).slice(0, 3).map(skill => 
                        `<span class="skill-tag">${skill}</span>`
                      ).join('') : 'N/A'}
                    </div>
                  </td>
                  <td>${new Date(applicant.appliedAt).toLocaleDateString()}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        ` : '<p><em>No applicants for this project yet.</em></p>'}
      </div>
    `;
  });

  html += `
            </div>

            <div class="footer">
                <p>Generated by SkillBridge Pro • ${currentDate}</p>
                <p>This report contains confidential applicant information. Please handle with care.</p>
            </div>
        </div>
    </body>
    </html>
  `;

  return html;
};

// Get project owner profile statistics
const getProjectOwnerStats = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const userRole = req.user?.role;
    
    console.log('Project Owner Stats - User ID:', userId);
    console.log('Project Owner Stats - User Role:', userRole);
    
    if (!userId) return sendError(res, "User ID is required", 400);

    // Get all projects owned by the user
    const ownedProjects = await ProjectModel.getProjectsByOwner(userId);
    
    // Get all applicants across all owned projects
    const allApplicants = [];
    for (const project of ownedProjects) {
      try {
        const applicants = await ProjectModel.getProjectApplicants(project.id);
        allApplicants.push(...applicants.map(app => ({ ...app, projectId: project.id, projectTitle: project.title })));
      } catch (e) {
        console.log(`Error fetching applicants for project ${project.id}:`, e);
      }
    }

    // Calculate statistics
    const totalProjects = ownedProjects.length;
    const activeProjects = ownedProjects.filter(p => p.status === 'active').length;
    const completedProjects = ownedProjects.filter(p => p.status === 'completed').length;
    const totalApplicants = allApplicants.length;
    const newApplicantsThisWeek = allApplicants.filter(app => {
      const appliedDate = new Date(app.appliedAt || app.createdAt);
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      return appliedDate >= weekAgo;
    }).length;

    // Calculate average rating from project reviews
    const avgRating = ownedProjects.length > 0 ? 
      (ownedProjects.reduce((sum, p) => sum + (p.averageRating || 0), 0) / ownedProjects.length).toFixed(1) : 0;

    // Calculate completion rate
    const completionRate = totalProjects > 0 ? Math.round((completedProjects / totalProjects) * 100) : 0;

    // Calculate developer reviews count
    const developerReviews = ownedProjects.reduce((sum, p) => sum + (p.reviewCount || 0), 0);

    return res.status(200).json({
      success: true,
      status: 200,
      stats: {
        totalProjects,
        activeProjects,
        completedProjects,
        totalApplicants,
        newApplicantsThisWeek,
        avgRating: parseFloat(avgRating),
        completionRate,
        developerReviews
      }
    });
  } catch (error) {
    console.error("Get Project Owner Stats Error:", error);
    return res.status(500).json({
      success: false,
      status: 500,
      message: "Failed to fetch project owner statistics",
      error: error.message
    });
  }
};

// Get project owner posted projects
const getProjectOwnerProjects = async (req, res) => {
  try {
    const userId = req.user?.userId;
    console.log('Project Owner Projects - User ID:', userId);
    
    if (!userId) return sendError(res, "User ID is required", 400);

    const projects = await ProjectModel.getProjectsByOwner(userId);
    console.log('Found projects for user:', projects.length, projects);
    
    // Enhance projects with additional data
    const enhancedProjects = await Promise.all(projects.map(async (project) => {
      try {
        const applicants = await ProjectModel.getProjectApplicants(project.id);
        const applicantCount = applicants.length;
        
        // Calculate match success rate (simplified)
        const matchSuccess = applicantCount > 0 ? Math.min(95, 70 + Math.random() * 25) : 0;
        
        return {
          id: project.id,
          title: project.title,
          status: project.status,
          applicants: applicantCount,
          budget: project.budgetMin && project.budgetMax ? 
            `$${project.budgetMin.toLocaleString()} - $${project.budgetMax.toLocaleString()}` : 
            'Not specified',
          duration: project.deadline ? 
            `${Math.ceil((new Date(project.deadline) - new Date(project.createdAt)) / (1000 * 60 * 60 * 24 * 30))} months` : 
            'Not specified',
          postedDate: new Date(project.createdAt).toISOString().split('T')[0],
          skills: project.skills || [],
          matchSuccess: Math.round(matchSuccess),
          averageRating: project.averageRating || 4.5
        };
      } catch (e) {
        console.log(`Error enhancing project ${project.id}:`, e);
        return {
          id: project.id,
          title: project.title,
          status: project.status,
          applicants: 0,
          budget: 'Not specified',
          duration: 'Not specified',
          postedDate: new Date(project.createdAt).toISOString().split('T')[0],
          skills: project.skills || [],
          matchSuccess: 0,
          averageRating: 0
        };
      }
    }));

    console.log('Enhanced projects:', enhancedProjects.length, enhancedProjects);
    
    return res.status(200).json({
      success: true,
      status: 200,
      projects: enhancedProjects
    });
  } catch (error) {
    console.error("Get Project Owner Projects Error:", error);
    return res.status(500).json({
      success: false,
      status: 500,
      message: "Failed to fetch project owner projects",
      error: error.message
    });
  }
};

// Get project owner developer reviews
const getProjectOwnerReviews = async (req, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return sendError(res, "User ID is required", 400);

    // Get all projects owned by the user
    const ownedProjects = await ProjectModel.getProjectsByOwner(userId);
    
    // Get reviews for all owned projects
    const allReviews = [];
    for (const project of ownedProjects) {
      try {
        const reviews = await ProjectModel.getProjectReviews(project.id);
        allReviews.push(...reviews.map(review => ({
          ...review,
          projectTitle: project.title
        })));
      } catch (e) {
        console.log(`Error fetching reviews for project ${project.id}:`, e);
      }
    }

    // Sort by date (most recent first) and limit to 10
    const sortedReviews = allReviews
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 10);

    return res.status(200).json({
      success: true,
      status: 200,
      reviews: sortedReviews
    });
  } catch (error) {
    console.error("Get Project Owner Reviews Error:", error);
    return res.status(500).json({
      success: false,
      status: 500,
      message: "Failed to fetch project owner reviews",
      error: error.message
    });
  }
};

// Get project owner developer management data
const getProjectOwnerDevelopers = async (req, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return sendError(res, "User ID is required", 400);

    // Get all projects owned by the user
    const ownedProjects = await ProjectModel.getProjectsByOwner(userId);
    
    // Get all applicants across all owned projects
    const allApplicants = [];
    for (const project of ownedProjects) {
      try {
        const applicants = await ProjectModel.getProjectApplicants(project.id);
        allApplicants.push(...applicants.map(app => ({
          ...app,
          projectId: project.id,
          projectTitle: project.title,
          projectCompany: project.company || 'Company',
          joined: new Date(app.appliedAt || app.createdAt).toISOString().split('T')[0]
        })));
      } catch (e) {
        console.log(`Error fetching applicants for project ${project.id}:`, e);
      }
    }

    // Transform applicants to developer management format
    const developers = allApplicants.map((applicant, index) => ({
      id: index + 1,
      name: applicant.name || applicant.fullName || applicant.username || `Developer ${applicant.userId}`,
      skills: applicant.skills || ['React', 'JavaScript', 'Node.js'],
      status: applicant.status === 'shortlisted' ? 'Active' : 
              applicant.status === 'applied' ? 'Onboarding' : 
              applicant.status === 'rejected' ? 'Suspended' : 'Active',
      project: applicant.projectTitle,
      joined: applicant.joined,
      userId: applicant.userId,
      email: applicant.email
    }));

    return res.status(200).json({
      success: true,
      status: 200,
      developers
    });
  } catch (error) {
    console.error("Get Project Owner Developers Error:", error);
    return res.status(500).json({
      success: false,
      status: 500,
      message: "Failed to fetch project owner developers",
      error: error.message
    });
  }
};

module.exports = {
  createProject,
  getProject,
  listProjects,
  getPublicProjects,
  updateProject,
  deleteProject,
  applyToProject,
  updateApplicantStatus,
  listApplicants,
  createInvite,
  cancelInvite,
  getMyInvites,
  getSentInvitations,
  respondInvite,
  addFile,
  getProjectFiles,
  addUpdate,
  addReview,
  addBoost,
  getProjectUpdates,
  getProjectReviews,
  getProjectBoosts,
  getProjectStats,
  searchProjects,
  getProjectRecommendations,
  getProjectCategories,
  getFilterOptions,
  addProjectFavorite,
  removeProjectFavorite,
  getProjectFavorites,
  withdrawApplication,
  addProjectSave,
  removeProjectSave,
  getProjectSaves,
  addProjectComment,
  getProjectComments,
  updateProjectComment,
  deleteProjectComment,
  getGlobalSkillsAndTags,
  getSearchSuggestions,
  listMyApplications,
  getMyApplicationsCount,
  getDeveloperAppliedProjects,
  generateApplicantsReport,
  getProjectOwnerStats,
  getProjectOwnerProjects,
  getProjectOwnerReviews,
  getProjectOwnerDevelopers,
};



