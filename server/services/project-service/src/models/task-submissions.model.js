const { pgTable, serial, text, integer, timestamp, json } = require("drizzle-orm/pg-core");
const { eq, and, desc, asc } = require("drizzle-orm");
const { db } = require("../config/database");
const { projectTasksTable } = require("./project-tasks.model");

// Task Submissions table - for developers to submit work for review
const taskSubmissionsTable = pgTable("task_submissions", {
  id: serial("id").primaryKey(),
  taskId: integer("task_id").notNull().references(() => projectTasksTable.id, { onDelete: "cascade" }), // FK -> project_tasks.id
  submittedBy: integer("submitted_by").notNull(), // FK -> users.id (developer who submitted)
  type: text("type").notNull(), // 'pull-request', 'file-upload', 'link'
  link: text("link"), // URL to PR/commit/repo
  files: json("files"), // Array of file objects: [{name, url, size}]
  notes: text("notes"), // Developer notes/description
  status: text("status").default("pending"), // 'pending', 'approved', 'rejected', 'changes-requested'
  reviewedBy: integer("reviewed_by"), // FK -> users.id (project owner/reviewer)
  reviewComments: text("review_comments"), // Reviewer feedback
  reviewedAt: timestamp("reviewed_at"),
  submittedAt: timestamp("submitted_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Task Submissions Model Class
class TaskSubmissionsModel {
  static async createSubmission({ taskId, submittedBy, type, link, files, notes }) {
    const [row] = await db.insert(taskSubmissionsTable).values({
      taskId,
      submittedBy,
      type,
      link,
      files: files ? JSON.stringify(files) : null,
      notes,
      status: "pending",
    }).returning();
    
    // Update task status to 'review'
    await db
      .update(projectTasksTable)
      .set({ status: "review", updatedAt: new Date() })
      .where(eq(projectTasksTable.id, taskId));
    
    return row;
  }

  static async getSubmissionById(submissionId) {
    const [submission] = await db
      .select()
      .from(taskSubmissionsTable)
      .where(eq(taskSubmissionsTable.id, submissionId));
    
    if (submission && submission.files) {
      try {
        submission.files = typeof submission.files === 'string' 
          ? JSON.parse(submission.files) 
          : submission.files;
      } catch (e) {
        submission.files = [];
      }
    }
    
    return submission;
  }

  static async getSubmissionsByTaskId(taskId) {
    const submissions = await db
      .select()
      .from(taskSubmissionsTable)
      .where(eq(taskSubmissionsTable.taskId, taskId))
      .orderBy(desc(taskSubmissionsTable.submittedAt));
    
    // Parse JSON files field
    return submissions.map(sub => {
      if (sub.files) {
        try {
          sub.files = typeof sub.files === 'string' ? JSON.parse(sub.files) : sub.files;
        } catch (e) {
          sub.files = [];
        }
      }
      return sub;
    });
  }

  static async getSubmissionsByDeveloper(developerId, options = {}) {
    const { status, limit } = options;
    const conditions = [eq(taskSubmissionsTable.submittedBy, developerId)];
    
    if (status) {
      conditions.push(eq(taskSubmissionsTable.status, status));
    }
    
    let query = db
      .select()
      .from(taskSubmissionsTable)
      .where(and(...conditions))
      .orderBy(desc(taskSubmissionsTable.submittedAt));
    
    if (limit) {
      query = query.limit(limit);
    }
    
    const submissions = await query;
    
    // Parse JSON files field
    return submissions.map(sub => {
      if (sub.files) {
        try {
          sub.files = typeof sub.files === 'string' ? JSON.parse(sub.files) : sub.files;
        } catch (e) {
          sub.files = [];
        }
      }
      return sub;
    });
  }

  static async updateSubmissionStatus(submissionId, status, reviewedBy, reviewComments) {
    const updateData = {
      status,
      reviewedBy,
      reviewComments,
      updatedAt: new Date(),
    };
    
    if (status !== "pending") {
      updateData.reviewedAt = new Date();
    }
    
    const [row] = await db
      .update(taskSubmissionsTable)
      .set(updateData)
      .where(eq(taskSubmissionsTable.id, submissionId))
      .returning();
    
    // Update task status based on submission status
    const submission = await this.getSubmissionById(submissionId);
    if (submission) {
      if (status === "approved") {
        // Check if all submissions are approved to mark task as completed
        const allSubmissions = await this.getSubmissionsByTaskId(submission.taskId);
        const allApproved = allSubmissions.every(s => s.status === "approved");
        if (allApproved) {
          await db
            .update(projectTasksTable)
            .set({ status: "completed", completedAt: new Date(), updatedAt: new Date() })
            .where(eq(projectTasksTable.id, submission.taskId));
        }
      } else if (status === "changes-requested" || status === "rejected") {
        // Change task status back to in_progress
        await db
          .update(projectTasksTable)
          .set({ status: "in_progress", updatedAt: new Date() })
          .where(eq(projectTasksTable.id, submission.taskId));
      }
    }
    
    return row;
  }

  static async deleteSubmission(submissionId) {
    const [row] = await db
      .delete(taskSubmissionsTable)
      .where(eq(taskSubmissionsTable.id, submissionId))
      .returning();
    return row;
  }

  static async getPendingSubmissions(projectId) {
    // Get all pending submissions for tasks in a project
    const submissions = await db
      .select({
        id: taskSubmissionsTable.id,
        taskId: taskSubmissionsTable.taskId,
        submittedBy: taskSubmissionsTable.submittedBy,
        type: taskSubmissionsTable.type,
        link: taskSubmissionsTable.link,
        files: taskSubmissionsTable.files,
        notes: taskSubmissionsTable.notes,
        status: taskSubmissionsTable.status,
        submittedAt: taskSubmissionsTable.submittedAt,
        projectId: projectTasksTable.projectId,
      })
      .from(taskSubmissionsTable)
      .innerJoin(projectTasksTable, eq(taskSubmissionsTable.taskId, projectTasksTable.id))
      .where(
        and(
          eq(projectTasksTable.projectId, projectId),
          eq(taskSubmissionsTable.status, "pending")
        )
      )
      .orderBy(desc(taskSubmissionsTable.submittedAt));
    
    return submissions.map(sub => {
      if (sub.files) {
        try {
          sub.files = typeof sub.files === 'string' ? JSON.parse(sub.files) : sub.files;
        } catch (e) {
          sub.files = [];
        }
      }
      return sub;
    });
  }
}

module.exports = {
  taskSubmissionsTable,
  TaskSubmissionsModel,
};

