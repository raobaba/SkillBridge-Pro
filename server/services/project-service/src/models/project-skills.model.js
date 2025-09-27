const { pgTable, serial, text, integer } = require("drizzle-orm/pg-core");
const { eq } = require("drizzle-orm");

const { db } = require("../config/database");

// Project Skills table
const projectSkillsTable = pgTable("project_skills", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").notNull(), // FK -> projects.id
  name: text("name").notNull(),
});

// Project Skills Model Class
class ProjectSkillsModel {
  static async setSkills(projectId, skills = []) {
    // naive replace strategy; optimize with upserts if needed
    await db.delete(projectSkillsTable).where(eq(projectSkillsTable.projectId, projectId));
    if (skills.length === 0) return [];
    const rows = await db.insert(projectSkillsTable).values(
      skills.map((name) => ({ projectId, name }))
    ).returning();
    return rows;
  }

  static async getSkillsByProjectId(projectId) {
    return await db
      .select()
      .from(projectSkillsTable)
      .where(eq(projectSkillsTable.projectId, projectId));
  }

  static async deleteSkillsByProjectId(projectId) {
    return await db.delete(projectSkillsTable).where(eq(projectSkillsTable.projectId, projectId));
  }
}

module.exports = {
  projectSkillsTable,
  ProjectSkillsModel,
};
