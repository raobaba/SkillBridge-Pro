const { pgTable, serial, text, integer, timestamp } = require("drizzle-orm/pg-core");
const { eq } = require("drizzle-orm");

const { db } = require("../config/database");

// Project Updates table
const projectUpdatesTable = pgTable("project_updates", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").notNull(), // FK -> projects.id
  authorId: integer("author_id").notNull(), // FK -> users.id
  type: text("type").default("note"), // note | status_change | milestone | activity
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Project Updates Model Class
class ProjectUpdatesModel {
  static async addUpdate({ projectId, authorId, type = "note", message }) {
    const [row] = await db.insert(projectUpdatesTable).values({
      projectId, authorId, type, message,
    }).returning();
    return row;
  }

  static async getUpdatesByProjectId(projectId) {
    return await db
      .select()
      .from(projectUpdatesTable)
      .where(eq(projectUpdatesTable.projectId, projectId))
      .orderBy(projectUpdatesTable.createdAt);
  }

  static async getUpdateById(updateId) {
    const [update] = await db
      .select()
      .from(projectUpdatesTable)
      .where(eq(projectUpdatesTable.id, updateId));
    return update;
  }

  static async getUpdatesByAuthor(authorId) {
    return await db
      .select()
      .from(projectUpdatesTable)
      .where(eq(projectUpdatesTable.authorId, authorId));
  }

  static async getUpdatesByType(projectId, type) {
    return await db
      .select()
      .from(projectUpdatesTable)
      .where(and(eq(projectUpdatesTable.projectId, projectId), eq(projectUpdatesTable.type, type)));
  }

  static async deleteUpdate(updateId) {
    const [row] = await db
      .delete(projectUpdatesTable)
      .where(eq(projectUpdatesTable.id, updateId))
      .returning();
    return row;
  }
}

module.exports = {
  projectUpdatesTable,
  ProjectUpdatesModel,
};
