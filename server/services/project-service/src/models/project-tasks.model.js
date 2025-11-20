const { pgTable, serial, text, integer, timestamp, boolean } = require("drizzle-orm/pg-core");
const { eq, and, desc, or, asc, sql } = require("drizzle-orm");

const { db } = require("../config/database");
const { projectMilestonesTable } = require("./project-milestones.model");
const { projectsTable } = require("./projects.model");

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
  static async addTask({ projectId, milestoneId, assignedTo, title, description, priority, dueDate, estimatedHours, repositoryUrl }) {
    const [row] = await db.insert(projectTasksTable).values({
      projectId, milestoneId, assignedTo, title, description, priority, dueDate,
      // Note: estimatedHours and repositoryUrl will be added via migration, for now they're ignored
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

  static async getTasksByAssignee(assignedTo, options = {}) {
    const { status, limit } = options;
    
    // Build conditions
    const conditions = [
      eq(projectTasksTable.assignedTo, assignedTo),
      eq(projectsTable.isDeleted, false), // Exclude tasks from deleted projects
    ];
    
    // Filter by status if provided (exclude completed and cancelled for active tasks)
    if (status) {
      conditions.push(eq(projectTasksTable.status, status));
    } else {
      // By default, exclude completed and cancelled tasks
      conditions.push(
        or(
          eq(projectTasksTable.status, "todo"),
          eq(projectTasksTable.status, "in_progress"),
          eq(projectTasksTable.status, "review")
        )
      );
    }
    
    let query = db
      .select({
        id: projectTasksTable.id,
        projectId: projectTasksTable.projectId,
        milestoneId: projectTasksTable.milestoneId,
        assignedTo: projectTasksTable.assignedTo,
        title: projectTasksTable.title,
        description: projectTasksTable.description,
        priority: projectTasksTable.priority,
        status: projectTasksTable.status,
        dueDate: projectTasksTable.dueDate,
        completedAt: projectTasksTable.completedAt,
        createdAt: projectTasksTable.createdAt,
        // Project information
        projectTitle: projectsTable.title,
        projectStatus: projectsTable.status,
      })
      .from(projectTasksTable)
      .innerJoin(projectsTable, eq(projectTasksTable.projectId, projectsTable.id))
      .where(and(...conditions))
      .orderBy(
        asc(projectTasksTable.dueDate), // Closest due dates first (NULLs last in PostgreSQL)
        desc(projectTasksTable.createdAt) // Newest tasks first if same due date
      );
    
    if (limit) {
      query = query.limit(limit);
    }
    
    return await query;
  }
  
  // Get all tasks for assignee (including completed)
  static async getAllTasksByAssignee(assignedTo, options = {}) {
    const { limit } = options;
    
    let query = db
      .select({
        id: projectTasksTable.id,
        projectId: projectTasksTable.projectId,
        milestoneId: projectTasksTable.milestoneId,
        assignedTo: projectTasksTable.assignedTo,
        title: projectTasksTable.title,
        description: projectTasksTable.description,
        priority: projectTasksTable.priority,
        status: projectTasksTable.status,
        dueDate: projectTasksTable.dueDate,
        completedAt: projectTasksTable.completedAt,
        createdAt: projectTasksTable.createdAt,
        // Project information
        projectTitle: projectsTable.title,
        projectStatus: projectsTable.status,
      })
      .from(projectTasksTable)
      .innerJoin(projectsTable, eq(projectTasksTable.projectId, projectsTable.id))
      .where(
        and(
          eq(projectTasksTable.assignedTo, assignedTo),
          eq(projectsTable.isDeleted, false) // Exclude tasks from deleted projects
        )
      )
      .orderBy(
        asc(projectTasksTable.dueDate), // Closest due dates first (NULLs last in PostgreSQL)
        desc(projectTasksTable.createdAt) // Newest tasks first if same due date
      );
    
    if (limit) {
      query = query.limit(limit);
    }
    
    return await query;
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

  // Get all tasks for a project owner (all tasks in their projects)
  static async getTasksByProjectOwner(ownerId, options = {}) {
    const { projectId, status, priority, limit, sortBy, sortOrder } = options;
    
    const conditions = [eq(projectsTable.ownerId, ownerId)];
    
    if (projectId) {
      conditions.push(eq(projectTasksTable.projectId, projectId));
    }
    if (status) {
      conditions.push(eq(projectTasksTable.status, status));
    }
    if (priority) {
      conditions.push(eq(projectTasksTable.priority, priority));
    }
    
    let query = db
      .select({
        id: projectTasksTable.id,
        projectId: projectTasksTable.projectId,
        milestoneId: projectTasksTable.milestoneId,
        assignedTo: projectTasksTable.assignedTo,
        title: projectTasksTable.title,
        description: projectTasksTable.description,
        priority: projectTasksTable.priority,
        status: projectTasksTable.status,
        dueDate: projectTasksTable.dueDate,
        completedAt: projectTasksTable.completedAt,
        createdAt: projectTasksTable.createdAt,
        projectTitle: projectsTable.title,
        projectStatus: projectsTable.status,
      })
      .from(projectTasksTable)
      .innerJoin(projectsTable, eq(projectTasksTable.projectId, projectsTable.id))
      .where(and(...conditions));
    
    // Sort
    if (sortBy === "dueDate") {
      query = query.orderBy(sortOrder === "desc" ? desc(projectTasksTable.dueDate) : asc(projectTasksTable.dueDate));
    } else if (sortBy === "priority") {
      query = query.orderBy(sortOrder === "desc" ? desc(projectTasksTable.priority) : asc(projectTasksTable.priority));
    } else if (sortBy === "status") {
      query = query.orderBy(sortOrder === "desc" ? desc(projectTasksTable.status) : asc(projectTasksTable.status));
    } else {
      query = query.orderBy(desc(projectTasksTable.createdAt));
    }
    
    if (limit) {
      query = query.limit(limit);
    }
    
    return await query;
  }

  // Bulk update tasks
  static async bulkUpdateTasks(taskIds, updateData) {
    if (!taskIds || taskIds.length === 0) return [];
    
    // Update each task individually for simplicity and compatibility
    const updatedTasks = [];
    for (const taskId of taskIds) {
      try {
        const updated = await this.updateTask(taskId, updateData);
        if (updated) updatedTasks.push(updated);
      } catch (error) {
        console.error(`Error updating task ${taskId}:`, error);
      }
    }
    return updatedTasks;
  }

  // Bulk delete tasks
  static async bulkDeleteTasks(taskIds) {
    if (!taskIds || taskIds.length === 0) return [];
    
    // Ensure all taskIds are numbers
    const validTaskIds = taskIds.map(id => Number(id)).filter(id => !isNaN(id) && id > 0);
    if (validTaskIds.length === 0) return [];
    
    // Delete each task individually
    const deletedTasks = [];
    for (const taskId of validTaskIds) {
      try {
        const deleted = await this.deleteTask(Number(taskId));
        if (deleted) deletedTasks.push(deleted);
      } catch (error) {
        console.error(`Error deleting task ${taskId}:`, error);
      }
    }
    return deletedTasks;
  }

  // Bulk assign tasks
  static async bulkAssignTasks(taskIds, assignedTo) {
    if (!taskIds || taskIds.length === 0) return [];
    
    // Assign each task individually
    const assignedTasks = [];
    for (const taskId of taskIds) {
      try {
        const assigned = await this.assignTask(taskId, assignedTo);
        if (assigned) assignedTasks.push(assigned);
      } catch (error) {
        console.error(`Error assigning task ${taskId}:`, error);
      }
    }
    return assignedTasks;
  }
}

module.exports = {
  projectTasksTable,
  ProjectTasksModel,
};
