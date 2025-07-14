/**
 * ---------------------------------
 * File: emailTemplates.js
 * Description:
 * This file contains a function that returns dynamic email templates based on a provided key. 
 * It supports both plain text and HTML versions of the templates, allowing for customized 
 * email content by inserting dynamic values through a `data` object. 
 * The templates include common use cases such as OTP generation, site visit notifications, 
 * video KYC scheduling, and KYC approval notifications.
 * 
 * Functionality:
 * - The `getEmailTemplate` function receives a template key (e.g., 'otp', 'visitBranch') 
 *   and dynamic data (e.g., OTP value, site visit details) to generate both plain text 
 *   and HTML versions of the email.
 * - If an invalid or unrecognized key is provided, a default response is returned.
 * 
 * Author: Rameshware Marbate
 * Created On: May-07-2025
 * Updated On: May-07-2025
 * 
 * Notes:
 * - Ensure that the `data` object contains the required fields (e.g., `otp`, `userName`) 
 *   for the template to be populated correctly.
 * - Extend the `templates` object to add more email templates as needed.
 * ---------------------------------
 */

/**
 * Returns an email template (text and HTML) based on the provided key.
 * Supports dynamic content insertion via the `data` object.
 *
 * @param {string} key - Identifier for the email template (e.g., 'otp', 'visitBranch').
 * @param {object} data - Object containing dynamic values to insert into the template.
 * @returns {{ text: string, html: string }} - The email content in plain text and HTML formats.
 */
function getEmailTemplate(key, data = {}) {
    const templates = {
        otp: {
            text: `Dear User,\n\nHere is your OTP: ${data.otp}\n\nPlease do not share this OTP with anyone.`,
            html: `<p>Dear User,</p><p>Here is your <strong>OTP: ${data.otp}</strong></p><p>Please do not share this OTP with anyone.</p>`,
        },
        agentRegistration: {
            html: ` <p>Hi ${data.firstName},</p>
                    <p>Welcome aboard! 🎉 We're excited to have you join us.</p>
                    <p>Here’s what’s next:</p>
                    <ul>
                        <li>✅ Access your agent dashboard</li>
                        <li>🔄 Complete your onboarding</li>
                        <li>📘 Explore training resources</li>
                        <li>🗓 Schedule onboarding call</li>
                        <li>💬 Join the agent community</li>
                    </ul>
                    <p>Warm regards,<br>${data.companyName}</p>`
        },
        licenseVerified: {
            html: `<p>Dear User,\n\nYour license has been verified. Now you can start contracting.</p>`
        },
        licenseRejected: {
            html: `<p>Dear User,\n\nYour license has been rejected.</p>`
        },
        surelcAccountCreated: {
            html: `<p>Dear User,\n\nYour SureLC account has been created successfully.</p>`
        }
    };

    return templates[key] || { text: "No template found", html: "<p>No template found</p>" };
}

module.exports = { getEmailTemplate };
