const { pgTable, serial, text, integer, timestamp } = require("drizzle-orm/pg-core");
const { eq, and } = require("drizzle-orm");

const { db } = require("../config/database");
const { projectsTable } = require("./projects.model");

// Project Collaborators table
const projectCollaboratorsTable = pgTable("project_collaborators", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").notNull().references(() => projectsTable.id, { onDelete: "cascade" }), // FK -> projects.id
  userId: integer("user_id").notNull(), // FK -> users.id
  role: text("role").notNull(),
  permissions: text("permissions").array(), // read, write, admin
  invitedBy: integer("invited_by").notNull(), // FK -> users.id
  invitedAt: timestamp("invited_at").defaultNow(),
  acceptedAt: timestamp("accepted_at"),
  status: text("status").default("pending"), // pending, accepted, declined, revoked
});

// Project Collaborators Model Class
class ProjectCollaboratorsModel {
  static async addCollaborator({ projectId, userId, role, permissions, invitedBy }) {
    const [row] = await db.insert(projectCollaboratorsTable).values({
      projectId, userId, role, permissions, invitedBy,
      status: "pending",
    }).returning();
    return row;
  }

  static async updateCollaboratorStatus({ projectId, userId, status }) {
    const [row] = await db
      .update(projectCollaboratorsTable)
      .set({ 
        status, 
        acceptedAt: status === "accepted" ? new Date() : null 
      })
      .where(and(eq(projectCollaboratorsTable.projectId, projectId), eq(projectCollaboratorsTable.userId, userId)))
      .returning();
    return row;
  }

  static async getCollaboratorsByProjectId(projectId) {
    return await db
      .select()
      .from(projectCollaboratorsTable)
      .where(eq(projectCollaboratorsTable.projectId, projectId));
  }

  static async getCollaboratorByProjectAndUser(projectId, userId) {
    const [collaborator] = await db
      .select()
      .from(projectCollaboratorsTable)
      .where(and(eq(projectCollaboratorsTable.projectId, projectId), eq(projectCollaboratorsTable.userId, userId)));
    return collaborator;
  }

  static async removeCollaborator(projectId, userId) {
    const [row] = await db
      .delete(projectCollaboratorsTable)
      .where(and(eq(projectCollaboratorsTable.projectId, projectId), eq(projectCollaboratorsTable.userId, userId)))
      .returning();
    return row;
  }

  static async getCollaboratorsByStatus(projectId, status) {
    return await db
      .select()
      .from(projectCollaboratorsTable)
      .where(and(eq(projectCollaboratorsTable.projectId, projectId), eq(projectCollaboratorsTable.status, status)));
  }
}

module.exports = {
  projectCollaboratorsTable,
  ProjectCollaboratorsModel,
};
