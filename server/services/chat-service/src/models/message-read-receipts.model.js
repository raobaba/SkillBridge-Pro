const { pgTable, serial, integer, timestamp } = require("drizzle-orm/pg-core");
const { eq, and } = require("drizzle-orm");
const { db } = require("../config/database");

// Message Read Receipts table - track who read which messages
const messageReadReceiptsTable = pgTable("message_read_receipts", {
  id: serial("id").primaryKey(),
  messageId: integer("message_id").notNull(), // FK -> messages.id
  userId: integer("user_id").notNull(), // FK -> users.id
  readAt: timestamp("read_at").defaultNow().notNull(),
});

class MessageReadReceiptsModel {
  /**
   * Create read receipts for messages
   */
  static async createReadReceipts(readReceipts) {
    if (!readReceipts || readReceipts.length === 0) return 0;

    // Filter out duplicates - check if receipt already exists for each
    const newReceipts = [];
    for (const receipt of readReceipts) {
      const exists = await this.isMessageReadByUser(receipt.messageId, receipt.userId);
      if (!exists) {
        newReceipts.push({
          messageId: Number(receipt.messageId),
          userId: Number(receipt.userId),
        });
      }
    }

    if (newReceipts.length > 0) {
      await db.insert(messageReadReceiptsTable).values(newReceipts);
    }

    return newReceipts.length;
  }

  /**
   * Get read receipts for a message
   */
  static async getReadReceiptsByMessageId(messageId) {
    return await db
      .select()
      .from(messageReadReceiptsTable)
      .where(eq(messageReadReceiptsTable.messageId, Number(messageId)));
  }

  /**
   * Get read receipts for multiple messages
   */
  static async getReadReceiptsByMessageIds(messageIds) {
    // Note: This is a simplified version. In production, you might want to use SQL IN clause
    const receipts = [];
    for (const messageId of messageIds) {
      const messageReceipts = await this.getReadReceiptsByMessageId(messageId);
      receipts.push(...messageReceipts);
    }
    return receipts;
  }

  /**
   * Get read receipts for a user
   */
  static async getReadReceiptsByUserId(userId) {
    return await db
      .select()
      .from(messageReadReceiptsTable)
      .where(eq(messageReadReceiptsTable.userId, Number(userId)));
  }

  /**
   * Check if a message was read by a user
   */
  static async isMessageReadByUser(messageId, userId) {
    const [receipt] = await db
      .select()
      .from(messageReadReceiptsTable)
      .where(
        and(
          eq(messageReadReceiptsTable.messageId, Number(messageId)),
          eq(messageReadReceiptsTable.userId, Number(userId))
        )
      );
    return !!receipt;
  }
}

module.exports = {
  messageReadReceiptsTable,
  MessageReadReceiptsModel,
};

