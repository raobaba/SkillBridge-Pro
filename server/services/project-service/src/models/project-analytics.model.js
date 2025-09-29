const { pgTable, serial, text, integer, timestamp, numeric, date } = require("drizzle-orm/pg-core");
const { eq, and } = require("drizzle-orm");

const { db } = require("../config/database");
const { projectsTable } = require("./projects.model");

// Project Analytics table
const projectAnalyticsTable = pgTable("project_analytics", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").notNull().references(() => projectsTable.id, { onDelete: "cascade" }), // FK -> projects.id
  metricName: text("metric_name").notNull(),
  metricValue: numeric("metric_value").notNull(),
  metricDate: date("metric_date").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Project Analytics Model Class
class ProjectAnalyticsModel {
  static async addMetric({ projectId, metricName, metricValue, metricDate }) {
    const [row] = await db.insert(projectAnalyticsTable).values({
      projectId, metricName, metricValue, metricDate,
    }).returning();
    return row;
  }

  static async getMetricsByProjectId(projectId) {
    return await db
      .select()
      .from(projectAnalyticsTable)
      .where(eq(projectAnalyticsTable.projectId, projectId));
  }

  static async getMetricsByProjectAndName(projectId, metricName) {
    return await db
      .select()
      .from(projectAnalyticsTable)
      .where(and(eq(projectAnalyticsTable.projectId, projectId), eq(projectAnalyticsTable.metricName, metricName)));
  }

  static async getMetricsByDateRange(projectId, startDate, endDate) {
    return await db
      .select()
      .from(projectAnalyticsTable)
      .where(and(
        eq(projectAnalyticsTable.projectId, projectId),
        // Add date range filtering logic here
      ));
  }

  static async updateMetric({ projectId, metricName, metricValue, metricDate }) {
    const [row] = await db
      .update(projectAnalyticsTable)
      .set({ metricValue })
      .where(and(
        eq(projectAnalyticsTable.projectId, projectId),
        eq(projectAnalyticsTable.metricName, metricName),
        eq(projectAnalyticsTable.metricDate, metricDate)
      ))
      .returning();
    return row;
  }

  static async deleteMetric(metricId) {
    const [row] = await db
      .delete(projectAnalyticsTable)
      .where(eq(projectAnalyticsTable.id, metricId))
      .returning();
    return row;
  }
}

module.exports = {
  projectAnalyticsTable,
  ProjectAnalyticsModel,
};
