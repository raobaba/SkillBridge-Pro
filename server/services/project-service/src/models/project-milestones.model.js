const { pgTable, serial, text, integer, timestamp, boolean } = require("drizzle-orm/pg-core");
const { eq, and } = require("drizzle-orm");

const { db } = require("../config/database");

// Project Milestones table
const projectMilestonesTable = pgTable("project_milestones", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").notNull(), // FK -> projects.id
  title: text("title").notNull(),
  description: text("description"),
  dueDate: timestamp("due_date"),
  completedAt: timestamp("completed_at"),
  isCompleted: boolean("is_completed").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Project Milestones Model Class
class ProjectMilestonesModel {
  static async addMilestone({ projectId, title, description, dueDate }) {
    const [row] = await db.insert(projectMilestonesTable).values({
      projectId, title, description, dueDate,
    }).returning();
    return row;
  }

  static async getMilestonesByProjectId(projectId) {
    return await db
      .select()
      .from(projectMilestonesTable)
      .where(eq(projectMilestonesTable.projectId, projectId))
      .orderBy(projectMilestonesTable.createdAt);
  }

  static async getMilestoneById(milestoneId) {
    const [milestone] = await db
      .select()
      .from(projectMilestonesTable)
      .where(eq(projectMilestonesTable.id, milestoneId));
    return milestone;
  }

  static async updateMilestone(milestoneId, updateData) {
    const [row] = await db
      .update(projectMilestonesTable)
      .set(updateData)
      .where(eq(projectMilestonesTable.id, milestoneId))
      .returning();
    return row;
  }

  static async markAsCompleted(milestoneId) {
    const [row] = await db
      .update(projectMilestonesTable)
      .set({ 
        isCompleted: true, 
        completedAt: new Date() 
      })
      .where(eq(projectMilestonesTable.id, milestoneId))
      .returning();
    return row;
  }

  static async markAsIncomplete(milestoneId) {
    const [row] = await db
      .update(projectMilestonesTable)
      .set({ 
        isCompleted: false, 
        completedAt: null 
      })
      .where(eq(projectMilestonesTable.id, milestoneId))
      .returning();
    return row;
  }

  static async deleteMilestone(milestoneId) {
    const [row] = await db
      .delete(projectMilestonesTable)
      .where(eq(projectMilestonesTable.id, milestoneId))
      .returning();
    return row;
  }

  static async getCompletedMilestones(projectId) {
    return await db
      .select()
      .from(projectMilestonesTable)
      .where(and(eq(projectMilestonesTable.projectId, projectId), eq(projectMilestonesTable.isCompleted, true)));
  }

  static async getPendingMilestones(projectId) {
    return await db
      .select()
      .from(projectMilestonesTable)
      .where(and(eq(projectMilestonesTable.projectId, projectId), eq(projectMilestonesTable.isCompleted, false)));
  }
}

module.exports = {
  projectMilestonesTable,
  ProjectMilestonesModel,
};
