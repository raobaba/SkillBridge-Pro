const { pgTable, serial, text, integer } = require("drizzle-orm/pg-core");
const { eq } = require("drizzle-orm");

const { db } = require("../config/database");
const { projectsTable } = require("./projects.model");

// Project Tags table
const projectTagsTable = pgTable("project_tags", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").notNull().references(() => projectsTable.id, { onDelete: "cascade" }), // FK -> projects.id
  name: text("name").notNull(),
});

// Project Tags Model Class
class ProjectTagsModel {
  static async setTags(projectId, tags = []) {
    await db.delete(projectTagsTable).where(eq(projectTagsTable.projectId, projectId));
    if (tags.length === 0) return [];
    const rows = await db.insert(projectTagsTable).values(
      tags.map((name) => ({ projectId, name }))
    ).returning();
    return rows;
  }

  static async getTagsByProjectId(projectId) {
    return await db
      .select()
      .from(projectTagsTable)
      .where(eq(projectTagsTable.projectId, projectId));
  }

  static async deleteTagsByProjectId(projectId) {
    return await db.delete(projectTagsTable).where(eq(projectTagsTable.projectId, projectId));
  }
}

module.exports = {
  projectTagsTable,
  ProjectTagsModel,
};
