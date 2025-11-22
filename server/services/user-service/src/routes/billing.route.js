const express = require("express");
const billingController = require("../controllers/billing.controller");
const authenticate = require("shared/middleware/auth.middleware");
const { requireRole } = require("shared/middleware/roleAuth.middleware");

const billingRouter = express.Router();

// All routes require authentication
billingRouter.use(authenticate);

// Get billing data (all users)
billingRouter.get("/", billingController.getBillingData);

// Subscription endpoints
billingRouter.get("/subscription-plans", billingController.getSubscriptionPlans);
billingRouter.post("/subscription/purchase", billingController.purchaseSubscription);
billingRouter.post("/subscription/cancel", billingController.cancelSubscription);

// Project visibility/boost endpoints (project owners)
billingRouter.post("/project/upgrade-visibility", billingController.upgradeProjectVisibility);

// Payment methods endpoints
billingRouter.get("/payment-methods", billingController.getPaymentMethods);
billingRouter.post("/payment-methods", billingController.addPaymentMethod);
billingRouter.delete("/payment-methods/:id", billingController.deletePaymentMethod);
billingRouter.put("/payment-methods/:id/set-default", billingController.setDefaultPaymentMethod);

// Disputes endpoints
billingRouter.post("/disputes", billingController.createDispute);
billingRouter.get("/disputes", requireRole(["admin"]), billingController.getDisputes);
billingRouter.put("/disputes/:id/resolve", requireRole(["admin"]), billingController.resolveDispute);

// Suspended accounts endpoints (admin only)
billingRouter.get("/suspended-accounts", requireRole(["admin"]), billingController.getSuspendedAccounts);
billingRouter.post("/suspended-accounts", requireRole(["admin"]), billingController.suspendAccount);
billingRouter.put("/suspended-accounts/:id/unsuspend", requireRole(["admin"]), billingController.unsuspendAccount);

// Admin dashboard endpoint
billingRouter.get("/admin/dashboard", requireRole(["admin"]), billingController.getAdminDashboard);

module.exports = billingRouter;

