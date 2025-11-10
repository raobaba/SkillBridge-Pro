const { pgTable, serial, text, integer, timestamp } = require("drizzle-orm/pg-core");
const { eq, and } = require("drizzle-orm");

const { db } = require("../config/database");

// Project Invites table
const projectInvitesTable = pgTable("project_invites", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").notNull(), // FK -> projects.id
  invitedEmail: text("invited_email").notNull(),
  invitedUserId: integer("invited_user_id"), // FK -> users.id (optional)
  role: text("role"),
  message: text("message"),
  status: text("status").default("pending"), // pending | accepted | declined | expired
  sentAt: timestamp("sent_at").defaultNow(),
  respondedAt: timestamp("responded_at"),
});

// Project Invites Model Class
class ProjectInvitesModel {
  static async createInvite({ projectId, invitedEmail, invitedUserId, role, message }) {
    const [row] = await db.insert(projectInvitesTable).values({
      projectId, invitedEmail, invitedUserId, role, message, status: "pending",
    }).returning();
    return row;
  }

  static async respondInvite({ inviteId, status }) {
    const [row] = await db
      .update(projectInvitesTable)
      .set({ status, respondedAt: new Date() })
      .where(eq(projectInvitesTable.id, inviteId))
      .returning();
    return row;
  }

  static async getInviteById(inviteId) {
    const [invite] = await db
      .select({
        id: projectInvitesTable.id,
        projectId: projectInvitesTable.projectId,
        invitedEmail: projectInvitesTable.invitedEmail,
        invitedUserId: projectInvitesTable.invitedUserId,
        role: projectInvitesTable.role,
        message: projectInvitesTable.message,
        status: projectInvitesTable.status,
        sentAt: projectInvitesTable.sentAt,
        respondedAt: projectInvitesTable.respondedAt
      })
      .from(projectInvitesTable)
      .where(eq(projectInvitesTable.id, inviteId));
    
    // Ensure projectId is properly set (handle any potential null/undefined)
    if (invite && !invite.projectId) {
      console.error("getInviteById returned invite without projectId:", invite);
    }
    
    return invite;
  }

  static async getInvitesByProjectId(projectId) {
    return await db
      .select()
      .from(projectInvitesTable)
      .where(eq(projectInvitesTable.projectId, projectId));
  }

  static async getInvitesByEmail(email) {
    const { sql } = require("drizzle-orm");
    
    // Join with projects table to get project information
    const invites = await db.execute(sql`
      SELECT 
        pi.id,
        pi.project_id as "projectId",
        pi.invited_email as "invitedEmail",
        pi.invited_user_id as "invitedUserId",
        pi.role,
        pi.message,
        pi.status,
        pi.sent_at as "sentAt",
        pi.responded_at as "respondedAt",
        p.title as "projectTitle",
        p.description as "projectDescription",
        p.status as "projectStatus",
        p.owner_id as "projectOwnerId",
        u.id as "ownerId",
        u.name as "projectOwnerName",
        u.email as "ownerEmail"
      FROM project_invites pi
      LEFT JOIN projects p ON pi.project_id = p.id
      LEFT JOIN users u ON p.owner_id = u.id
      WHERE pi.invited_email = ${email}
        AND (p.is_deleted = false OR p.is_deleted IS NULL)
      ORDER BY pi.sent_at DESC
    `);
    
    // Ensure all field names are properly camelCased
    return (invites.rows || []).map(invite => ({
      id: invite.id,
      projectId: invite.projectId || invite.project_id,
      invitedEmail: invite.invitedEmail || invite.invited_email,
      invitedUserId: invite.invitedUserId || invite.invited_user_id,
      role: invite.role,
      message: invite.message,
      status: invite.status,
      sentAt: invite.sentAt || invite.sent_at,
      respondedAt: invite.respondedAt || invite.responded_at,
      projectTitle: invite.projectTitle || invite.project_title || null,
      projectName: invite.projectTitle || invite.project_title || null, // Alias for compatibility
      projectDescription: invite.projectDescription || invite.project_description || null,
      projectStatus: invite.projectStatus || invite.project_status || null,
      projectOwnerId: invite.projectOwnerId || invite.project_owner_id || null,
      projectOwnerName: invite.projectOwnerName || invite.project_owner_name || null,
      ownerEmail: invite.ownerEmail || invite.owner_email || null,
      createdAt: invite.sentAt || invite.sent_at, // Alias for compatibility
      invitedAt: invite.sentAt || invite.sent_at, // Alias for compatibility
    }));
  }

  static async getInvitesByStatus(status) {
    return await db
      .select()
      .from(projectInvitesTable)
      .where(eq(projectInvitesTable.status, status));
  }

  static async deleteInvite(inviteId) {
    const [deleted] = await db
      .delete(projectInvitesTable)
      .where(eq(projectInvitesTable.id, inviteId))
      .returning();
    return deleted;
  }

  static async getInvitesByProjectIdAndUserId(projectId, invitedUserId) {
    if (!invitedUserId) {
      return [];
    }
    return await db
      .select()
      .from(projectInvitesTable)
      .where(and(
        eq(projectInvitesTable.projectId, projectId),
        eq(projectInvitesTable.invitedUserId, invitedUserId)
      ));
  }

  // Get all invites sent by a project owner (for all their projects)
  static async getInvitesByProjectOwner(projectOwnerId) {
    const { sql } = require("drizzle-orm");
    
    const invites = await db.execute(sql`
      SELECT 
        pi.id,
        pi.project_id as "projectId",
        pi.invited_email as "invitedEmail",
        pi.invited_user_id as "invitedUserId",
        pi.role,
        pi.message,
        pi.status,
        pi.sent_at as "sentAt",
        pi.responded_at as "respondedAt",
        u.id as "developerId",
        u.name,
        u.email,
        u.bio,
        u.avatar_url as "avatarUrl",
        u.skills,
        u.experience,
        u.location,
        u.availability,
        u.github_url as "githubUrl",
        u.linkedin_url as "linkedinUrl",
        u.portfolio_url as "portfolioUrl",
        u.xp,
        u.level
      FROM project_invites pi
      LEFT JOIN projects p ON pi.project_id = p.id
      LEFT JOIN users u ON pi.invited_user_id = u.id
      WHERE p.owner_id = ${projectOwnerId}
        AND pi.status IN ('pending', 'accepted')
        AND (u.is_deleted = false OR u.is_deleted IS NULL)
        AND pi.invited_user_id IS NOT NULL
      ORDER BY pi.sent_at DESC
    `);
    
    // Ensure all field names are properly camelCased
    return (invites.rows || []).map(invite => ({
      ...invite,
      projectId: invite.projectId || invite.project_id,
      developerId: invite.developerId || invite.invitedUserId,
      invitedUserId: invite.invitedUserId || invite.invited_user_id,
      invitedEmail: invite.invitedEmail || invite.invited_email,
      sentAt: invite.sentAt || invite.sent_at,
      respondedAt: invite.respondedAt || invite.responded_at,
      avatarUrl: invite.avatarUrl || invite.avatar_url,
      githubUrl: invite.githubUrl || invite.github_url,
      linkedinUrl: invite.linkedinUrl || invite.linkedin_url,
      portfolioUrl: invite.portfolioUrl || invite.portfolio_url
    }));
  }
}

module.exports = {
  projectInvitesTable,
  ProjectInvitesModel,
};
