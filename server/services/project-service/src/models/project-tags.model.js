const { pgTable, serial, text, integer } = require("drizzle-orm/pg-core");
const { eq, inArray, ilike } = require("drizzle-orm");

const { db } = require("../config/database");

// Tags reference table (global tags)
const tagsTable = pgTable("tags", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  category: text("category"), // e.g., "Technology", "Domain", "Type", etc.
});

// Project-Tags junction table (many-to-many relationship)
const projectTagsTable = pgTable("project_tags", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").notNull(), // FK -> projects.id
  tagId: integer("tag_id").notNull(), // FK -> tags.id
});

// Tags Model Class
class ProjectTagsModel {
  // Add tags to the reference table (constant reference data)
  static async addTags(tags = []) {
    if (tags.length === 0) return [];
    const rows = await db.insert(tagsTable).values(
      tags.map((tag) => ({ 
        name: tag.name || tag, 
        category: tag.category || 'General'
      }))
    ).onConflictDoNothing().returning();
    return rows;
  }

  // Get all tags from reference table
  static async getAllTags() {
    return await db
      .select()
      .from(tagsTable)
      .orderBy(tagsTable.category, tagsTable.name);
  }

  // Set project tags (many-to-many relationship)
  static async setProjectTags(projectId, tagNames = []) {
    // Delete existing project tags
    await db.delete(projectTagsTable).where(
      eq(projectTagsTable.projectId, projectId)
    );
    
    if (tagNames.length === 0) return [];

    // Get tag IDs for the given tag names
    const tags = await db
      .select({ id: tagsTable.id })
      .from(tagsTable)
      .where(inArray(tagsTable.name, tagNames));

    if (tags.length === 0) return [];

    // Insert project-tag relationships
    const rows = await db.insert(projectTagsTable).values(
      tags.map((tag) => ({ 
        projectId, 
        tagId: tag.id
      }))
    ).returning();
    return rows;
  }

  // Get tags for a specific project (with tag names)
  static async getTagsByProjectId(projectId) {
    return await db
      .select({ 
        id: projectTagsTable.id,
        projectId: projectTagsTable.projectId,
        tagId: projectTagsTable.tagId,
        tagName: tagsTable.name,
        tagCategory: tagsTable.category
      })
      .from(projectTagsTable)
      .innerJoin(tagsTable, eq(projectTagsTable.tagId, tagsTable.id))
      .where(eq(projectTagsTable.projectId, projectId));
  }

  // Delete project tags
  static async deleteProjectTags(projectId) {
    return await db.delete(projectTagsTable).where(eq(projectTagsTable.projectId, projectId));
  }

  // Search tags by name (for suggestions)
  static async searchTags(query) {
    return await db
      .select({ name: tagsTable.name })
      .from(tagsTable)
      .where(ilike(tagsTable.name, `%${query}%`))
      .orderBy(tagsTable.name)
      .limit(10);
  }
}

module.exports = {
  tagsTable,
  projectTagsTable,
  ProjectTagsModel,
};
