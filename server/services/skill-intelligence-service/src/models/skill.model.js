const {
  pgTable,
  serial,
  text,
  varchar,
  timestamp,
  boolean,
  integer,
  uuid,
  numeric,
} = require("drizzle-orm/pg-core");

const { eq, and } = require("drizzle-orm");

const { db } = require("../config/database");
const { userTable } = require("../../../user-service/src/models/user.model");

// Skills table
const skillsTable = pgTable("skills", {
  id: serial("id").primaryKey(),
  userUuid: uuid("user_uuid")
    .notNull()
    .references(() => userTable.uuid, { onDelete: "cascade" }),
  skillName: text("skill_name").notNull(),
  category: text("category"),
  yearsOfExperience: integer("years_of_experience").default(0),
  lastUsed: timestamp("last_used"),
  verified: boolean("verified").default(false),
  verificationSource: text("verification_source"),
  confidenceScore: numeric("confidence_score", { precision: 5, scale: 2 }),
  relevanceScore: numeric("relevance_score", { precision: 5, scale: 2 }),
  projectsCount: integer("projects_count").default(0),
  certificationUrl: text("certification_url"),
  endorsements: integer("endorsements").default(0),
  isPrimary: boolean("is_primary").default(false),
  isDeleted: boolean("is_deleted").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

// Skills model
class SkillModel {
  static async addSkill(skillObject) {
    const [skill] = await db
      .insert(skillsTable)
      .values(skillObject)
      .returning();
    return skill;
  }

  static async getSkillById(id) {
    const [skill] = await db
      .select()
      .from(skillsTable)
      .where(eq(skillsTable.id, id));
    return skill;
  }

  static async getUserSkills(userUuid) {
    const skills = await db
      .select()
      .from(skillsTable)
      .where(eq(skillsTable.userUuid, userUuid));
    return skills;
  }

  static async updateSkill(id, skillObject) {
    const [skill] = await db
      .update(skillsTable)
      .set(skillObject)
      .where(eq(skillsTable.id, id))
      .returning();
    return skill;
  }

  static async deleteSkill(id) {
    const [skill] = await db
      .delete(skillsTable)
      .where(eq(skillsTable.id, id))
      .returning();
    return skill;
  }

  static async deleteUserSkills(userUuid) {
    const skills = await db
      .delete(skillsTable)
      .where(eq(skillsTable.userUuid, userUuid))
      .returning();
    return skills;
  }
}

module.exports = {
  skillsTable,
  SkillModel,
};
