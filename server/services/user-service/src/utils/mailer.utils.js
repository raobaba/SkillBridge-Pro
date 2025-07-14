/**
 * ---------------------------------
 * File: mailer.js
 * Description:
 * This file handles sending emails through Nodemailer, using dynamic email templates.
 * It connects to an SMTP server using credentials from environment variables,
 * and sends emails with dynamic content based on templates.
 *
 * Key Features:
 * - **Email Templates**: Dynamic content is inserted into predefined email templates (`otp`, `visitBranch`, etc.).
 * - **Transporter**: Uses Nodemailer to create an email transporter configured with SMTP server details.
 * - **Email Sending**: Function to send emails with customizable subjects and dynamic data (via templates).
 * - **Template Wrappers**: Predefined wrapper functions for sending specific types of emails like OTP, KYC, site visit, etc.
 *
 * Dependencies:
 * - `nodemailer`: Library for sending emails in Node.js.
 * - `dotenv`: Loads environment variables for email configuration.
 * - `emailTemplates.utils`: Utility module for generating email templates with dynamic content.
 *
 * Author: Rameshware Marbate
 * Created On: May-07-2025
 * Updated On: May-07-2025
 *
 * Notes:
 * - Requires environment variables such as `MAIL_HOST`, `MAIL_PORT`, `MAIL_USER`, `MAIL_PASS`, and `MAIL_FROM` for SMTP configuration.
 * - The transporter is set up to use TLS with `rejectUnauthorized: false` for secure connections.
 * - Template keys like `'otp'`, `'visitBranch'`, etc. are used to fetch corresponding templates with dynamic data.
 * ---------------------------------
 */

const { createTransport } = require("nodemailer");
const dotenv = require("dotenv");
const { getEmailTemplate } = require("./emailTemplates.utils");

dotenv.config();

// Create a transporter
const transporter = createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

/**
 * Send an email with dynamic content
 * @param {string} to - Recipient email
 * @param {string} subject - Email subject
 * @param {string} templateKey - Key to get the email template
 * @param {object} templateData - Data to replace placeholders in the template
 */
async function sendEmail(to, subject, templateKey, templateData = {}) {
  if (!to || !subject || !templateKey) {
    throw new Error("Missing parameters for email sending.");
  }

  // Validate email format
  if (!/^\S+@\S+\.\S+$/.test(to)) {
    throw new Error("Invalid email format.");
  }

  try {
    const { text, html } = getEmailTemplate(templateKey, templateData);

    await transporter.sendMail({
      from: process.env.MAIL_FROM,
      to,
      subject,
      text,
      html,
    });

    console.log(`✅ Email sent to ${to}: ${subject}`);
  } catch (e) {
    console.error("❌ Mail Error:", e.message);
    // throw new Error("Failed to send email.");
  }
}

// Wrappers for specific email types
const sendEmailForOtp = (to, otp) =>
  sendEmail(to, "Your One Time Password (OTP)", "otp", { otp });
const sendEmailForVisitBranch = (to) =>
  sendEmail(to, "Visit Your Branch for Next Steps", "visitBranch");
const sendEmailForSiteVisitSchedule = (to) =>
  sendEmail(to, "Site Visit Scheduled!", "siteVisit");
const sendEmailForVideoKYCSchedule = (to) =>
  sendEmail(to, "Video KYC Scheduled!", "videoKYC");
const sendEmailForKYCApproved = (to) =>
  sendEmail(to, "KYC Approved!", "kycApproved");
const sendEmailForAgentRegistration = (to, data) =>
  sendEmail(
    to,
    `Welcome to Our Platform, ${data.firstName}`,
    "agentRegistration",
    data
  );
const sendEmailForLicenseVerified = (to) =>
  sendEmail(to, "License Verified", "licenseVerified");

const sendEmailForSureLcAccountCreate = (to) =>
  sendEmail(to, "Sure LC Account Created", "surelcAccountCreated");

const sendEmailForLicenseRejection = (to) =>
  sendEmail(to, "License Rejected", "licenseRejected");
module.exports = {
  sendEmailForOtp,
  sendEmailForVisitBranch,
  sendEmailForSiteVisitSchedule,
  sendEmailForVideoKYCSchedule,
  sendEmailForKYCApproved,
  sendEmailForAgentRegistration,
  sendEmailForLicenseVerified,
  sendEmailForLicenseRejection,
  sendEmailForSureLcAccountCreate
};
