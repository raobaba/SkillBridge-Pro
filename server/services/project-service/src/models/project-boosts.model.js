const { pgTable, serial, text, integer, timestamp, varchar, pgEnum } = require("drizzle-orm/pg-core");
const { eq } = require("drizzle-orm");

const { db } = require("../config/database");
const { ProjectsModel, projectsTable } = require("./projects.model");

// Enums
const boostPlanEnum = pgEnum("boost_plan", ["basic", "premium", "spotlight"]);

// Project Boosts table
const projectBoostsTable = pgTable("project_boosts", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").notNull().references(() => projectsTable.id, { onDelete: "cascade" }), // FK -> projects.id
  purchasedBy: integer("purchased_by").notNull(), // FK -> users.id
  plan: boostPlanEnum("plan").default("basic").notNull(),
  amountCents: integer("amount_cents").notNull(),
  currency: varchar("currency", { length: 8 }).default("USD"),
  startAt: timestamp("start_at").notNull(),
  endAt: timestamp("end_at").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Project Boosts Model Class
class ProjectBoostsModel {
  static async addBoost({ projectId, purchasedBy, plan, amountCents, currency = "USD", startAt, endAt }) {
    const [row] = await db.insert(projectBoostsTable).values({
      projectId, purchasedBy, plan, amountCents, currency, startAt, endAt,
    }).returning();

    await ProjectsModel.setFeatured(projectId, endAt);
    return row;
  }

  static async getBoostsByProjectId(projectId) {
    return await db
      .select()
      .from(projectBoostsTable)
      .where(eq(projectBoostsTable.projectId, projectId));
  }

  static async getBoostById(boostId) {
    const [boost] = await db
      .select()
      .from(projectBoostsTable)
      .where(eq(projectBoostsTable.id, boostId));
    return boost;
  }

  static async getBoostsByPurchaser(purchasedBy) {
    return await db
      .select()
      .from(projectBoostsTable)
      .where(eq(projectBoostsTable.purchasedBy, purchasedBy));
  }

  static async getBoostsByPlan(plan) {
    return await db
      .select()
      .from(projectBoostsTable)
      .where(eq(projectBoostsTable.plan, plan));
  }

  static async getActiveBoosts() {
    const now = new Date();
    return await db
      .select()
      .from(projectBoostsTable)
      .where(and(
        eq(projectBoostsTable.startAt, now), // This needs to be fixed with proper date comparison
        eq(projectBoostsTable.endAt, now)   // This needs to be fixed with proper date comparison
      ));
  }

  static async deleteBoost(boostId) {
    const [row] = await db
      .delete(projectBoostsTable)
      .where(eq(projectBoostsTable.id, boostId))
      .returning();
    return row;
  }

  static async getTotalSpentByUser(userId) {
    const boosts = await this.getBoostsByPurchaser(userId);
    return boosts.reduce((total, boost) => total + boost.amountCents, 0);
  }
}

module.exports = {
  projectBoostsTable,
  ProjectBoostsModel,
};
