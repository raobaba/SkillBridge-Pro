const { pgTable, serial, text, integer } = require("drizzle-orm/pg-core");
const { eq, inArray, ilike } = require("drizzle-orm");

const { db } = require("../config/database");

// Skills reference table (global skills)
const skillsTable = pgTable("skills", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  category: text("category"), // e.g., "Frontend", "Backend", "Database", etc.
});

// Project-Skills junction table (many-to-many relationship)
const projectSkillsTable = pgTable("project_skills", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").notNull(), // FK -> projects.id
  skillId: integer("skill_id").notNull(), // FK -> skills.id
});

// Skills Model Class
class ProjectSkillsModel {
  // Add skills to the reference table (constant reference data)
  static async addSkills(skills = []) {
    if (skills.length === 0) return [];
    const rows = await db.insert(skillsTable).values(
      skills.map((skill) => ({ 
        name: skill.name || skill, 
        category: skill.category || 'General'
      }))
    ).onConflictDoNothing().returning();
    return rows;
  }

  // Get all skills from reference table
  static async getAllSkills() {
    return await db
      .select()
      .from(skillsTable)
      .orderBy(skillsTable.category, skillsTable.name);
  }

  // Set project skills (many-to-many relationship)
  static async setProjectSkills(projectId, skillNames = []) {
    // Delete existing project skills
    await db.delete(projectSkillsTable).where(
      eq(projectSkillsTable.projectId, projectId)
    );
    
    if (skillNames.length === 0) return [];

    // Get skill IDs for the given skill names
    const skills = await db
      .select({ id: skillsTable.id })
      .from(skillsTable)
      .where(inArray(skillsTable.name, skillNames));

    if (skills.length === 0) return [];

    // Insert project-skill relationships
    const rows = await db.insert(projectSkillsTable).values(
      skills.map((skill) => ({ 
        projectId, 
        skillId: skill.id
      }))
    ).returning();
    return rows;
  }

  // Get skills for a specific project (with skill names)
  static async getSkillsByProjectId(projectId) {
    return await db
      .select({ 
        id: projectSkillsTable.id,
        projectId: projectSkillsTable.projectId,
        skillId: projectSkillsTable.skillId,
        skillName: skillsTable.name,
        skillCategory: skillsTable.category
      })
      .from(projectSkillsTable)
      .innerJoin(skillsTable, eq(projectSkillsTable.skillId, skillsTable.id))
      .where(eq(projectSkillsTable.projectId, projectId));
  }

  // Delete project skills
  static async deleteProjectSkills(projectId) {
    return await db.delete(projectSkillsTable).where(eq(projectSkillsTable.projectId, projectId));
  }

  // Search skills by name (for suggestions)
  static async searchSkills(query) {
    return await db
      .select({ name: skillsTable.name })
      .from(skillsTable)
      .where(ilike(skillsTable.name, `%${query}%`))
      .orderBy(skillsTable.name)
      .limit(10);
  }
}

module.exports = {
  skillsTable,
  projectSkillsTable,
  ProjectSkillsModel,
};
