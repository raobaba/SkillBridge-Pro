const { pgTable, serial, text, integer, timestamp } = require("drizzle-orm/pg-core");
const { eq } = require("drizzle-orm");

const { db } = require("../config/database");

// Project Files table
const projectFilesTable = pgTable("project_files", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").notNull(), // FK -> projects.id
  uploaderId: integer("uploader_id").notNull(), // FK -> users.id
  name: text("name").notNull(),
  url: text("url").notNull(),
  mimeType: text("mime_type"),
  sizeKb: integer("size_kb"),
  description: text("description"),
  category: text("category").default("other"),
  uploadedAt: timestamp("uploaded_at").defaultNow(),
});

// Project Files Model Class
class ProjectFilesModel {
  static async addFile({ projectId, uploaderId, name, url, mimeType, sizeKb, description, category }) {
    const [row] = await db.insert(projectFilesTable).values({
      projectId, uploaderId, name, url, mimeType, sizeKb, description, category,
    }).returning();
    return row;
  }

  static async getFilesByProjectId(projectId) {
    return await db
      .select()
      .from(projectFilesTable)
      .where(eq(projectFilesTable.projectId, projectId));
  }

  static async getFileById(fileId) {
    const [file] = await db
      .select()
      .from(projectFilesTable)
      .where(eq(projectFilesTable.id, fileId));
    return file;
  }

  static async deleteFile(fileId) {
    const [row] = await db
      .delete(projectFilesTable)
      .where(eq(projectFilesTable.id, fileId))
      .returning();
    return row;
  }

  static async getFilesByUploader(uploaderId) {
    return await db
      .select()
      .from(projectFilesTable)
      .where(eq(projectFilesTable.uploaderId, uploaderId));
  }

  static async getFilesByMimeType(projectId, mimeType) {
    return await db
      .select()
      .from(projectFilesTable)
      .where(and(eq(projectFilesTable.projectId, projectId), eq(projectFilesTable.mimeType, mimeType)));
  }
}

module.exports = {
  projectFilesTable,
  ProjectFilesModel,
};
