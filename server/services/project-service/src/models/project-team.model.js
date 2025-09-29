const { pgTable, serial, text, integer, timestamp } = require("drizzle-orm/pg-core");
const { eq, and } = require("drizzle-orm");

const { db } = require("../config/database");
const { projectsTable } = require("./projects.model");

// Project Team table
const projectTeamTable = pgTable("project_team", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").notNull().references(() => projectsTable.id, { onDelete: "cascade" }), // FK -> projects.id
  userId: integer("user_id").notNull(), // FK -> users.id
  role: text("role"),
  joinedAt: timestamp("joined_at").defaultNow(),
});

// Project Team Model Class
class ProjectTeamModel {
  static async addTeamMember({ projectId, userId, role }) {
    const [row] = await db.insert(projectTeamTable).values({
      projectId, userId, role,
    }).returning();
    return row;
  }

  static async removeTeamMember(projectId, userId) {
    const [row] = await db
      .delete(projectTeamTable)
      .where(and(eq(projectTeamTable.projectId, projectId), eq(projectTeamTable.userId, userId)))
      .returning();
    return row;
  }

  static async getTeamMembers(projectId) {
    return await db
      .select()
      .from(projectTeamTable)
      .where(eq(projectTeamTable.projectId, projectId));
  }

  static async getTeamMember(projectId, userId) {
    const [member] = await db
      .select()
      .from(projectTeamTable)
      .where(and(eq(projectTeamTable.projectId, projectId), eq(projectTeamTable.userId, userId)));
    return member;
  }

  static async updateTeamMemberRole(projectId, userId, role) {
    const [row] = await db
      .update(projectTeamTable)
      .set({ role })
      .where(and(eq(projectTeamTable.projectId, projectId), eq(projectTeamTable.userId, userId)))
      .returning();
    return row;
  }

  static async getProjectsByUserId(userId) {
    return await db
      .select()
      .from(projectTeamTable)
      .where(eq(projectTeamTable.userId, userId));
  }
}

module.exports = {
  projectTeamTable,
  ProjectTeamModel,
};
