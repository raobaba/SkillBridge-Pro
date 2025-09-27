const { pgTable, serial, text, integer, timestamp } = require("drizzle-orm/pg-core");
const { eq } = require("drizzle-orm");

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
      .select()
      .from(projectInvitesTable)
      .where(eq(projectInvitesTable.id, inviteId));
    return invite;
  }

  static async getInvitesByProjectId(projectId) {
    return await db
      .select()
      .from(projectInvitesTable)
      .where(eq(projectInvitesTable.projectId, projectId));
  }

  static async getInvitesByEmail(email) {
    return await db
      .select()
      .from(projectInvitesTable)
      .where(eq(projectInvitesTable.invitedEmail, email));
  }

  static async getInvitesByStatus(status) {
    return await db
      .select()
      .from(projectInvitesTable)
      .where(eq(projectInvitesTable.status, status));
  }
}

module.exports = {
  projectInvitesTable,
  ProjectInvitesModel,
};
