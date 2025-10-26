const { pgTable, serial, text, integer, timestamp, boolean } = require("drizzle-orm/pg-core");
const { eq, and } = require("drizzle-orm");

const { db } = require("../config/database");
const { projectMilestonesTable } = require("./project-milestones.model");

// Project Tasks table
const projectTasksTable = pgTable("project_tasks", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").notNull(), // FK -> projects.id
  milestoneId: integer("milestone_id").references(() => projectMilestonesTable.id, { onDelete: "set null" }), // FK -> project_milestones.id
  assignedTo: integer("assigned_to"), // FK -> users.id
  title: text("title").notNull(),
  description: text("description"),
  priority: text("priority").default("medium"), // low, medium, high, urgent
  status: text("status").default("todo"), // todo, in_progress, review, completed, cancelled
  dueDate: timestamp("due_date"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Project Tasks Model Class
class ProjectTasksModel {
  static async addTask({ projectId, milestoneId, assignedTo, title, description, priority, dueDate }) {
    const [row] = await db.insert(projectTasksTable).values({
      projectId, milestoneId, assignedTo, title, description, priority, dueDate,
    }).returning();
    return row;
  }

  static async getTasksByProjectId(projectId) {
    return await db
      .select()
      .from(projectTasksTable)
      .where(eq(projectTasksTable.projectId, projectId))
      .orderBy(projectTasksTable.createdAt);
  }

  static async getTasksByMilestoneId(milestoneId) {
    return await db
      .select()
      .from(projectTasksTable)
      .where(eq(projectTasksTable.milestoneId, milestoneId))
      .orderBy(projectTasksTable.createdAt);
  }

  static async getTasksByAssignee(assignedTo) {
    return await db
      .select()
      .from(projectTasksTable)
      .where(eq(projectTasksTable.assignedTo, assignedTo))
      .orderBy(projectTasksTable.createdAt);
  }

  static async getTaskById(taskId) {
    const [task] = await db
      .select()
      .from(projectTasksTable)
      .where(eq(projectTasksTable.id, taskId));
    return task;
  }

  static async updateTask(taskId, updateData) {
    const [row] = await db
      .update(projectTasksTable)
      .set(updateData)
      .where(eq(projectTasksTable.id, taskId))
      .returning();
    return row;
  }

  static async updateTaskStatus(taskId, status) {
    const updateData = { status };
    if (status === "completed") {
      updateData.completedAt = new Date();
    } else if (status !== "completed") {
      updateData.completedAt = null;
    }

    const [row] = await db
      .update(projectTasksTable)
      .set(updateData)
      .where(eq(projectTasksTable.id, taskId))
      .returning();
    return row;
  }

  static async assignTask(taskId, assignedTo) {
    const [row] = await db
      .update(projectTasksTable)
      .set({ assignedTo })
      .where(eq(projectTasksTable.id, taskId))
      .returning();
    return row;
  }

  static async deleteTask(taskId) {
    const [row] = await db
      .delete(projectTasksTable)
      .where(eq(projectTasksTable.id, taskId))
      .returning();
    return row;
  }

  static async getTasksByStatus(projectId, status) {
    return await db
      .select()
      .from(projectTasksTable)
      .where(and(eq(projectTasksTable.projectId, projectId), eq(projectTasksTable.status, status)));
  }

  static async getTasksByPriority(projectId, priority) {
    return await db
      .select()
      .from(projectTasksTable)
      .where(and(eq(projectTasksTable.projectId, projectId), eq(projectTasksTable.priority, priority)));
  }
}

module.exports = {
  projectTasksTable,
  ProjectTasksModel,
};
