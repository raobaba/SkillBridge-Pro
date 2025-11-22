const {
  pgTable,
  serial,
  integer,
  text,
  timestamp,
  boolean,
  numeric,
  json,
  pgEnum,
} = require("drizzle-orm/pg-core");
const { eq, and, desc, gte, lte } = require("drizzle-orm");
const { db } = require("../config/database");

// Enums
const paymentStatusEnum = pgEnum("payment_status", [
  "pending",
  "completed",
  "failed",
  "refunded",
  "cancelled",
]);
const subscriptionStatusEnum = pgEnum("subscription_status", [
  "active",
  "cancelled",
  "expired",
  "suspended",
  "trial",
]);
const disputeStatusEnum = pgEnum("dispute_status", [
  "pending",
  "investigating",
  "resolved",
  "rejected",
]);

// Billing History Table
const billingHistoryTable = pgTable("billing_history", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  currency: text("currency").default("USD").notNull(),
  status: paymentStatusEnum("status").default("pending").notNull(),
  description: text("description"),
  invoiceId: text("invoice_id"),
  paymentMethodId: integer("payment_method_id"),
  type: text("type").notNull(), // 'subscription', 'boost', 'one-time', 'refund'
  metadata: json("metadata"), // Additional data like project_id for boosts
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

// Payment Methods Table
const paymentMethodsTable = pgTable("payment_methods", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  type: text("type").notNull(), // 'credit_card', 'paypal', 'bank_account'
  brand: text("brand"), // 'Visa', 'Mastercard', 'PayPal', etc.
  last4: text("last4"), // Last 4 digits of card
  expiryMonth: integer("expiry_month"),
  expiryYear: integer("expiry_year"),
  cardholderName: text("cardholder_name"),
  isDefault: boolean("is_default").default(false).notNull(),
  billingAddress: json("billing_address"), // Full address object
  stripePaymentMethodId: text("stripe_payment_method_id"), // Stripe ID if using Stripe
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

// Invoices Table
const invoicesTable = pgTable("invoices", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  invoiceNumber: text("invoice_number").unique().notNull(),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  currency: text("currency").default("USD").notNull(),
  status: text("status").default("draft").notNull(), // 'draft', 'sent', 'paid', 'overdue', 'cancelled'
  items: json("items").notNull(), // Array of invoice items
  subtotal: numeric("subtotal", { precision: 10, scale: 2 }),
  tax: numeric("tax", { precision: 10, scale: 2 }),
  total: numeric("total", { precision: 10, scale: 2 }).notNull(),
  dueDate: timestamp("due_date"),
  paidAt: timestamp("paid_at"),
  billingHistoryId: integer("billing_history_id"), // Link to billing_history
  pdfUrl: text("pdf_url"), // URL to generated PDF
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

// Disputes Table
const disputesTable = pgTable("disputes", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  billingHistoryId: integer("billing_history_id"),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  reason: text("reason").notNull(),
  description: text("description"),
  status: disputeStatusEnum("status").default("pending").notNull(),
  priority: text("priority").default("medium"), // 'low', 'medium', 'high'
  resolution: text("resolution"), // Resolution notes
  resolvedAt: timestamp("resolved_at"),
  resolvedBy: integer("resolved_by"), // Admin user ID
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

// Subscription Plans Table (for reference)
const subscriptionPlansTable = pgTable("subscription_plans", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  currency: text("currency").default("USD").notNull(),
  period: text("period").notNull(), // 'monthly', 'yearly'
  features: json("features").notNull(), // Array of features
  aiCredits: integer("ai_credits").default(0),
  maxProjects: integer("max_projects"), // -1 for unlimited
  maxApplications: integer("max_applications"), // -1 for unlimited
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

// Suspended Accounts Table (for admin)
const suspendedAccountsTable = pgTable("suspended_accounts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  reason: text("reason").notNull(),
  amount: numeric("amount", { precision: 10, scale: 2 }),
  daysOverdue: integer("days_overdue").default(0),
  status: text("status").default("suspended"), // 'suspended', 'unsuspended'
  suspendedAt: timestamp("suspended_at").defaultNow().notNull(),
  unsuspendedAt: timestamp("unsuspended_at"),
  suspendedBy: integer("suspended_by"), // Admin user ID
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

// Billing History Model
class BillingHistoryModel {
  static async createBillingRecord(data) {
    const [record] = await db
      .insert(billingHistoryTable)
      .values(data)
      .returning();
    return record;
  }

  static async getBillingHistoryByUserId(userId, limit = 50) {
    return await db
      .select()
      .from(billingHistoryTable)
      .where(eq(billingHistoryTable.userId, userId))
      .orderBy(desc(billingHistoryTable.createdAt))
      .limit(limit);
  }

  static async getBillingRecordById(id) {
    const [record] = await db
      .select()
      .from(billingHistoryTable)
      .where(eq(billingHistoryTable.id, id));
    return record;
  }

  static async updateBillingRecord(id, data) {
    const [record] = await db
      .update(billingHistoryTable)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(billingHistoryTable.id, id))
      .returning();
    return record;
  }
}

// Payment Methods Model
class PaymentMethodsModel {
  static async createPaymentMethod(data) {
    const [method] = await db
      .insert(paymentMethodsTable)
      .values(data)
      .returning();
    return method;
  }

  static async getPaymentMethodsByUserId(userId) {
    return await db
      .select()
      .from(paymentMethodsTable)
      .where(
        and(
          eq(paymentMethodsTable.userId, userId),
          eq(paymentMethodsTable.isActive, true)
        )
      )
      .orderBy(desc(paymentMethodsTable.isDefault), desc(paymentMethodsTable.createdAt));
  }

  static async getPaymentMethodById(id) {
    const [method] = await db
      .select()
      .from(paymentMethodsTable)
      .where(eq(paymentMethodsTable.id, id));
    return method;
  }

  static async updatePaymentMethod(id, data) {
    const [method] = await db
      .update(paymentMethodsTable)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(paymentMethodsTable.id, id))
      .returning();
    return method;
  }

  static async deletePaymentMethod(id) {
    const [method] = await db
      .update(paymentMethodsTable)
      .set({ isActive: false, updatedAt: new Date() })
      .where(eq(paymentMethodsTable.id, id))
      .returning();
    return method;
  }

  static async setDefaultPaymentMethod(userId, methodId) {
    // First, unset all default methods for this user
    await db
      .update(paymentMethodsTable)
      .set({ isDefault: false, updatedAt: new Date() })
      .where(eq(paymentMethodsTable.userId, userId));

    // Then set the new default
    const [method] = await db
      .update(paymentMethodsTable)
      .set({ isDefault: true, updatedAt: new Date() })
      .where(eq(paymentMethodsTable.id, methodId))
      .returning();
    return method;
  }
}

// Invoices Model
class InvoicesModel {
  static async createInvoice(data) {
    const [invoice] = await db
      .insert(invoicesTable)
      .values(data)
      .returning();
    return invoice;
  }

  static async getInvoicesByUserId(userId, limit = 50) {
    return await db
      .select()
      .from(invoicesTable)
      .where(eq(invoicesTable.userId, userId))
      .orderBy(desc(invoicesTable.createdAt))
      .limit(limit);
  }

  static async getInvoiceById(id) {
    const [invoice] = await db
      .select()
      .from(invoicesTable)
      .where(eq(invoicesTable.id, id));
    return invoice;
  }

  static async getInvoiceByInvoiceNumber(invoiceNumber) {
    const [invoice] = await db
      .select()
      .from(invoicesTable)
      .where(eq(invoicesTable.invoiceNumber, invoiceNumber));
    return invoice;
  }

  static async updateInvoice(id, data) {
    const [invoice] = await db
      .update(invoicesTable)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(invoicesTable.id, id))
      .returning();
    return invoice;
  }
}

// Disputes Model
class DisputesModel {
  static async createDispute(data) {
    const [dispute] = await db
      .insert(disputesTable)
      .values(data)
      .returning();
    return dispute;
  }

  static async getDisputesByUserId(userId, limit = 50) {
    return await db
      .select()
      .from(disputesTable)
      .where(eq(disputesTable.userId, userId))
      .orderBy(desc(disputesTable.createdAt))
      .limit(limit);
  }

  static async getAllDisputes(status = null, limit = 100) {
    const conditions = [];
    if (status) {
      conditions.push(eq(disputesTable.status, status));
    }
    return await db
      .select()
      .from(disputesTable)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(disputesTable.createdAt))
      .limit(limit);
  }

  static async getDisputeById(id) {
    const [dispute] = await db
      .select()
      .from(disputesTable)
      .where(eq(disputesTable.id, id));
    return dispute;
  }

  static async updateDispute(id, data) {
    const [dispute] = await db
      .update(disputesTable)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(disputesTable.id, id))
      .returning();
    return dispute;
  }

  static async resolveDispute(id, resolvedBy, resolution) {
    const [dispute] = await db
      .update(disputesTable)
      .set({
        status: "resolved",
        resolvedAt: new Date(),
        resolvedBy,
        resolution,
        updatedAt: new Date(),
      })
      .where(eq(disputesTable.id, id))
      .returning();
    return dispute;
  }
}

// Subscription Plans Model
class SubscriptionPlansModel {
  static async getAllPlans() {
    return await db
      .select()
      .from(subscriptionPlansTable)
      .where(eq(subscriptionPlansTable.isActive, true))
      .orderBy(subscriptionPlansTable.price);
  }

  static async getPlanById(id) {
    const [plan] = await db
      .select()
      .from(subscriptionPlansTable)
      .where(eq(subscriptionPlansTable.id, id));
    return plan;
  }

  static async getPlanByName(name) {
    const [plan] = await db
      .select()
      .from(subscriptionPlansTable)
      .where(eq(subscriptionPlansTable.name, name));
    return plan;
  }
}

// Suspended Accounts Model
class SuspendedAccountsModel {
  static async createSuspendedAccount(data) {
    const [account] = await db
      .insert(suspendedAccountsTable)
      .values(data)
      .returning();
    return account;
  }

  static async getAllSuspendedAccounts(limit = 100) {
    return await db
      .select()
      .from(suspendedAccountsTable)
      .where(eq(suspendedAccountsTable.status, "suspended"))
      .orderBy(desc(suspendedAccountsTable.suspendedAt))
      .limit(limit);
  }

  static async getSuspendedAccountByUserId(userId) {
    const [account] = await db
      .select()
      .from(suspendedAccountsTable)
      .where(
        and(
          eq(suspendedAccountsTable.userId, userId),
          eq(suspendedAccountsTable.status, "suspended")
        )
      )
      .orderBy(desc(suspendedAccountsTable.suspendedAt))
      .limit(1);
    return account;
  }

  static async unsuspendAccount(id, unsuspendedBy) {
    const [account] = await db
      .update(suspendedAccountsTable)
      .set({
        status: "unsuspended",
        unsuspendedAt: new Date(),
        unsuspendedBy,
        updatedAt: new Date(),
      })
      .where(eq(suspendedAccountsTable.id, id))
      .returning();
    return account;
  }
}

module.exports = {
  billingHistoryTable,
  paymentMethodsTable,
  invoicesTable,
  disputesTable,
  subscriptionPlansTable,
  suspendedAccountsTable,
  BillingHistoryModel,
  PaymentMethodsModel,
  InvoicesModel,
  DisputesModel,
  SubscriptionPlansModel,
  SuspendedAccountsModel,
};

