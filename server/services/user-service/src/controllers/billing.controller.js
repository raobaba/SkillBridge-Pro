const {
  BillingHistoryModel,
  PaymentMethodsModel,
  InvoicesModel,
  DisputesModel,
  SubscriptionPlansModel,
  SuspendedAccountsModel,
} = require("../models/billing.model");
const HttpException = require("shared/utils/HttpException.utils");
const { db } = require("../config/database");
const { sql, eq } = require("drizzle-orm");

// Helper to get user info from database
const getUserInfo = async (userId) => {
  try {
    const userQuery = await db.execute(sql`
      SELECT id, name, email, role 
      FROM users 
      WHERE id = ${userId} AND is_deleted = false
    `);
    
    if (userQuery.rows && userQuery.rows.length > 0) {
      return userQuery.rows[0];
    }
    return null;
  } catch (error) {
    console.error("Error fetching user info:", error.message);
    return null;
  }
};

/**
 * Get billing data for current user
 * GET /api/v1/user/billing
 */
const getBillingData = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const userRole = req.user.role || "developer";

    // Get subscription from user_subscriptions table
    const subscriptionQuery = await db.execute(sql`
      SELECT * FROM user_subscriptions 
      WHERE user_id = ${userId} 
      LIMIT 1
    `);
    const subscription = subscriptionQuery.rows && subscriptionQuery.rows.length > 0 ? subscriptionQuery.rows[0] : null;
    
    // Get billing history
    const billingHistory = await BillingHistoryModel.getBillingHistoryByUserId(userId, 50);
    
    // Get payment methods
    const paymentMethods = await PaymentMethodsModel.getPaymentMethodsByUserId(userId);

    // Get plan details from database if subscription exists
    let planDetails = null;
    if (subscription?.plan) {
      planDetails = await SubscriptionPlansModel.getPlanByName(subscription.plan);
    }
    
    // If no plan found, get Free plan as default
    if (!planDetails && (!subscription || !subscription.plan)) {
      planDetails = await SubscriptionPlansModel.getPlanByName('Free');
    }
    
    // Format subscription data
    const subscriptionData = subscription && planDetails ? {
      plan: subscription.plan?.toLowerCase() || "free",
      status: subscription.status || "active",
      aiCredits: planDetails.aiCredits || 0,
      enhancedTools: subscription.plan?.toLowerCase() !== "free",
      matchmakingBoost: userRole === "project-owner" || userRole === "project_owner",
      projectVisibility: subscription.plan?.toLowerCase() !== "free" ? "premium" : "standard",
      nextBillingDate: subscription.currentPeriodEnd ? new Date(subscription.currentPeriodEnd).toISOString().split('T')[0] : null,
      autoRenew: subscription.status === "active",
      startDate: subscription.currentPeriodStart ? new Date(subscription.currentPeriodStart).toISOString().split('T')[0] : null,
      planFeatures: {
        aiCredits: planDetails.aiCredits || 0,
        maxProjects: planDetails.maxProjects,
        maxApplications: planDetails.maxApplications,
        supportLevel: subscription.plan?.toLowerCase() === "enterprise" ? "24/7" : subscription.plan?.toLowerCase() === "pro" ? "priority" : "community",
        analytics: subscription.plan?.toLowerCase() !== "free",
        customBranding: subscription.plan?.toLowerCase() === "enterprise",
      },
    } : {
      plan: "free",
      status: "active",
      aiCredits: planDetails?.aiCredits || 100,
      enhancedTools: false,
      matchmakingBoost: false,
      projectVisibility: "standard",
      nextBillingDate: null,
      autoRenew: false,
      startDate: null,
      planFeatures: {
        aiCredits: planDetails?.aiCredits || 100,
        maxProjects: planDetails?.maxProjects || 3,
        maxApplications: planDetails?.maxApplications || 10,
        supportLevel: "community",
        analytics: false,
        customBranding: false,
      },
    };

    // Format billing history
    const formattedHistory = billingHistory.map(record => ({
      id: record.id,
      date: record.createdAt.toISOString().split('T')[0],
      amount: `$${parseFloat(record.amount).toFixed(2)}`,
      status: record.status === "completed" ? "Paid" : record.status === "pending" ? "Pending" : record.status,
      description: record.description || "Payment",
      invoiceId: record.invoiceId,
      paymentMethod: record.paymentMethodId ? "Card" : "N/A",
      type: record.type,
    }));

    // Format payment methods
    const formattedPaymentMethods = paymentMethods.map(method => ({
      id: method.id,
      type: method.type === "credit_card" ? "Credit Card" : method.type,
      last4: method.last4,
      default: method.isDefault,
      brand: method.brand,
      expiryMonth: method.expiryMonth,
      expiryYear: method.expiryYear,
      cardholderName: method.cardholderName,
      billingAddress: method.billingAddress,
    }));

    // Get admin data if admin
    let adminData = null;
    if (userRole === "admin") {
      adminData = await getAdminBillingData();
    }

    // Get project owner data if project owner
    let projectOwnerData = null;
    if (userRole === "project-owner" || userRole === "project_owner") {
      projectOwnerData = await getProjectOwnerBillingData(userId);
    }

    res.status(200).json({
      success: true,
      data: {
        subscription: subscriptionData,
        billingHistory: formattedHistory,
        paymentMethods: formattedPaymentMethods,
        ...(adminData && { adminData }),
        ...(projectOwnerData && { projectOwnerData }),
      },
    });
  } catch (error) {
    console.error("Get billing data error:", error);
    next(new HttpException(500, error.message || "Failed to fetch billing data"));
  }
};

/**
 * Purchase subscription
 * POST /api/v1/user/billing/subscription/purchase
 */
const purchaseSubscription = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { planId, paymentMethodId } = req.body;

    if (!planId) {
      return next(new HttpException(400, "Plan ID is required"));
    }

    // Get plan details from database
    const selectedPlan = await SubscriptionPlansModel.getPlanById(planId);
    
    if (!selectedPlan) {
      return next(new HttpException(404, "Plan not found"));
    }

    // Create billing history record
    const billingRecord = await BillingHistoryModel.createBillingRecord({
      userId,
      amount: selectedPlan.price.toString(),
      currency: selectedPlan.currency || "USD",
      status: "completed", // In production, this would be pending until payment confirmation
      description: `${selectedPlan.name} Plan - ${selectedPlan.period === 'forever' ? 'Forever' : 'Monthly'} Subscription`,
      invoiceId: `INV-${selectedPlan.name.toUpperCase()}-${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`,
      paymentMethodId: paymentMethodId || null,
      type: "subscription",
      metadata: { planId, planName: selectedPlan.name },
    });

    // Update or create subscription
    const now = new Date();
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());
    
    // Check if subscription exists
    const existingSubQuery = await db.execute(sql`
      SELECT * FROM user_subscriptions 
      WHERE user_id = ${userId} 
      LIMIT 1
    `);
    
    if (existingSubQuery.rows && existingSubQuery.rows.length > 0) {
      // Update existing
      await db.execute(sql`
        UPDATE user_subscriptions 
        SET plan = ${selectedPlan.name},
            status = 'active',
            current_period_start = ${now.toISOString()},
            current_period_end = ${nextMonth.toISOString()},
            updated_at = NOW()
        WHERE user_id = ${userId}
      `);
    } else {
      // Create new
      await db.execute(sql`
        INSERT INTO user_subscriptions (user_id, plan, status, current_period_start, current_period_end)
        VALUES (${userId}, ${selectedPlan.name}, 'active', ${now.toISOString()}, ${nextMonth.toISOString()})
      `);
    }

    // Create invoice
    const invoiceNumber = `INV-${Date.now()}-${userId}`;
    await InvoicesModel.createInvoice({
      userId,
      invoiceNumber,
      amount: selectedPlan.price.toString(),
      currency: "USD",
      status: "paid",
      items: [
        {
          description: `${selectedPlan.name} Plan Subscription`,
          quantity: 1,
          price: selectedPlan.price,
        },
      ],
      subtotal: selectedPlan.price.toString(),
      tax: "0.00",
      total: selectedPlan.price.toString(),
      paidAt: now,
      billingHistoryId: billingRecord.id,
    });

    // Get updated subscription
    const subscriptionQuery = await db.execute(sql`
      SELECT * FROM user_subscriptions 
      WHERE user_id = ${userId} 
      LIMIT 1
    `);
    const subscription = subscriptionQuery.rows && subscriptionQuery.rows.length > 0 ? subscriptionQuery.rows[0] : null;

    res.status(200).json({
      success: true,
      data: {
        subscription: {
          plan: subscription?.plan?.toLowerCase() || selectedPlan.name.toLowerCase(),
          status: "active",
          aiCredits: selectedPlan.aiCredits || 0,
          enhancedTools: selectedPlan.name?.toLowerCase() !== "free",
          matchmakingBoost: selectedPlan.name?.toLowerCase() !== "free",
          projectVisibility: selectedPlan.name?.toLowerCase() !== "free" ? "premium" : "standard",
          nextBillingDate: nextMonth.toISOString().split('T')[0],
          autoRenew: true,
          startDate: now.toISOString().split('T')[0],
          planFeatures: {
            aiCredits: selectedPlan.aiCredits || 0,
            maxProjects: selectedPlan.maxProjects,
            maxApplications: selectedPlan.maxApplications,
            supportLevel: selectedPlan.name?.toLowerCase() === "enterprise" ? "24/7" : selectedPlan.name?.toLowerCase() === "pro" ? "priority" : "community",
            analytics: selectedPlan.name?.toLowerCase() !== "free",
            customBranding: selectedPlan.name?.toLowerCase() === "enterprise",
          },
        },
        billingHistory: {
          id: billingRecord.id,
          date: billingRecord.createdAt.toISOString().split('T')[0],
          amount: `$${parseFloat(selectedPlan.price).toFixed(2)}`,
          status: "Paid",
          description: `${selectedPlan.name} Plan - Monthly Subscription`,
          invoiceId: billingRecord.invoiceId,
          paymentMethod: paymentMethodId ? "Card" : "N/A",
          type: "subscription",
        },
      },
    });
  } catch (error) {
    console.error("Purchase subscription error:", error);
    next(new HttpException(500, error.message || "Failed to purchase subscription"));
  }
};

/**
 * Upgrade project visibility
 * POST /api/v1/user/billing/project/upgrade-visibility
 */
const upgradeProjectVisibility = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { projectId, visibilityType } = req.body;

    if (!projectId || !visibilityType) {
      return next(new HttpException(400, "Project ID and visibility type are required"));
    }

    const boostCosts = {
      standard: 10.00,
      premium: 15.00,
      featured: 20.00,
    };

    const cost = boostCosts[visibilityType] || 15.00;
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days

    // Create billing history record
    const billingRecord = await BillingHistoryModel.createBillingRecord({
      userId,
      amount: cost.toString(),
      currency: "USD",
      status: "completed",
      description: `Project Boost - ${visibilityType.charAt(0).toUpperCase() + visibilityType.slice(1)}`,
      invoiceId: `INV-BOOST-${projectId}`,
      type: "boost",
      metadata: { projectId, visibilityType, expiresAt: expiresAt.toISOString() },
    });

    // Get project name (would need to fetch from project service)
    const projectName = `Project ${projectId}`;

    const boostedProject = {
      id: projectId,
      name: projectName,
      boostType: visibilityType,
      expiresAt: expiresAt.toISOString().split('T')[0],
      cost,
      purchasedAt: now.toISOString().split('T')[0],
      status: "active",
    };

    res.status(200).json({
      success: true,
      data: {
        boostedProject,
        billingHistory: {
          id: billingRecord.id,
          date: billingRecord.createdAt.toISOString().split('T')[0],
          amount: `$${cost.toFixed(2)}`,
          status: "Paid",
          description: `Project Boost - ${visibilityType.charAt(0).toUpperCase() + visibilityType.slice(1)}`,
          invoiceId: billingRecord.invoiceId,
          paymentMethod: "Card",
          type: "boost",
        },
      },
    });
  } catch (error) {
    console.error("Upgrade project visibility error:", error);
    next(new HttpException(500, error.message || "Failed to upgrade project visibility"));
  }
};

/**
 * Get payment methods
 * GET /api/v1/user/billing/payment-methods
 */
const getPaymentMethods = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const paymentMethods = await PaymentMethodsModel.getPaymentMethodsByUserId(userId);

    const formatted = paymentMethods.map(method => ({
      id: method.id,
      type: method.type === "credit_card" ? "Credit Card" : method.type,
      last4: method.last4,
      default: method.isDefault,
      brand: method.brand,
      expiryMonth: method.expiryMonth,
      expiryYear: method.expiryYear,
      cardholderName: method.cardholderName,
      billingAddress: method.billingAddress,
    }));

    res.status(200).json({
      success: true,
      data: formatted,
    });
  } catch (error) {
    console.error("Get payment methods error:", error);
    next(new HttpException(500, error.message || "Failed to fetch payment methods"));
  }
};

/**
 * Add payment method
 * POST /api/v1/user/billing/payment-methods
 */
const addPaymentMethod = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const {
      type,
      brand,
      last4,
      expiryMonth,
      expiryYear,
      cardholderName,
      billingAddress,
      stripePaymentMethodId,
      isDefault,
    } = req.body;

    if (!type || !last4) {
      return next(new HttpException(400, "Type and last4 are required"));
    }

    // If setting as default, unset other defaults first
    if (isDefault) {
      await PaymentMethodsModel.setDefaultPaymentMethod(userId, null);
    }

    const paymentMethod = await PaymentMethodsModel.createPaymentMethod({
      userId,
      type: type === "Credit Card" ? "credit_card" : type.toLowerCase(),
      brand,
      last4,
      expiryMonth,
      expiryYear,
      cardholderName,
      billingAddress,
      stripePaymentMethodId,
      isDefault: isDefault || false,
      isActive: true,
    });

    res.status(201).json({
      success: true,
      data: {
        id: paymentMethod.id,
        type: paymentMethod.type === "credit_card" ? "Credit Card" : paymentMethod.type,
        last4: paymentMethod.last4,
        default: paymentMethod.isDefault,
        brand: paymentMethod.brand,
        expiryMonth: paymentMethod.expiryMonth,
        expiryYear: paymentMethod.expiryYear,
        cardholderName: paymentMethod.cardholderName,
        billingAddress: paymentMethod.billingAddress,
      },
    });
  } catch (error) {
    console.error("Add payment method error:", error);
    next(new HttpException(500, error.message || "Failed to add payment method"));
  }
};

/**
 * Delete payment method
 * DELETE /api/v1/user/billing/payment-methods/:id
 */
const deletePaymentMethod = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;

    const method = await PaymentMethodsModel.getPaymentMethodById(parseInt(id));
    if (!method) {
      return next(new HttpException(404, "Payment method not found"));
    }

    if (method.userId !== userId) {
      return next(new HttpException(403, "You don't have permission to delete this payment method"));
    }

    await PaymentMethodsModel.deletePaymentMethod(parseInt(id));

    res.status(200).json({
      success: true,
      message: "Payment method deleted successfully",
    });
  } catch (error) {
    console.error("Delete payment method error:", error);
    next(new HttpException(500, error.message || "Failed to delete payment method"));
  }
};

/**
 * Set default payment method
 * PUT /api/v1/user/billing/payment-methods/:id/set-default
 */
const setDefaultPaymentMethod = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;

    const method = await PaymentMethodsModel.getPaymentMethodById(parseInt(id));
    if (!method) {
      return next(new HttpException(404, "Payment method not found"));
    }

    if (method.userId !== userId) {
      return next(new HttpException(403, "You don't have permission to modify this payment method"));
    }

    await PaymentMethodsModel.setDefaultPaymentMethod(userId, parseInt(id));

    res.status(200).json({
      success: true,
      message: "Default payment method updated successfully",
    });
  } catch (error) {
    console.error("Set default payment method error:", error);
    next(new HttpException(500, error.message || "Failed to set default payment method"));
  }
};

/**
 * Get subscription plans
 * GET /api/v1/user/billing/subscription-plans
 */
const getSubscriptionPlans = async (req, res, next) => {
  try {
    // Get plans from database
    const plans = await SubscriptionPlansModel.getAllPlans();
    
    // Format plans to match expected structure
    const formattedPlans = plans.map(plan => ({
      id: plan.id,
      name: plan.name,
      price: parseFloat(plan.price),
      period: plan.period,
      features: typeof plan.features === 'string' ? JSON.parse(plan.features) : plan.features,
      aiCredits: plan.aiCredits || 0,
      maxProjects: plan.maxProjects,
      maxApplications: plan.maxApplications,
      popular: plan.name.toLowerCase() === 'pro', // Mark Pro as popular
      currency: plan.currency || 'USD',
      isActive: plan.isActive,
    }));
    
    res.status(200).json({
      success: true,
      data: formattedPlans,
    });
  } catch (error) {
    console.error("Get subscription plans error:", error);
    next(new HttpException(500, error.message || "Failed to fetch subscription plans"));
  }
};

/**
 * Cancel subscription
 * POST /api/v1/user/billing/subscription/cancel
 */
const cancelSubscription = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    // Update subscription to cancelled
    const now = new Date();
    const existingSubQuery = await db.execute(sql`
      SELECT * FROM user_subscriptions 
      WHERE user_id = ${userId} 
      LIMIT 1
    `);
    
    if (existingSubQuery.rows && existingSubQuery.rows.length > 0) {
      await db.execute(sql`
        UPDATE user_subscriptions 
        SET plan = 'Free',
            status = 'cancelled',
            current_period_end = ${now.toISOString()},
            updated_at = NOW()
        WHERE user_id = ${userId}
      `);
    } else {
      await db.execute(sql`
        INSERT INTO user_subscriptions (user_id, plan, status, current_period_end)
        VALUES (${userId}, 'Free', 'cancelled', ${now.toISOString()})
      `);
    }

    const subscriptionQuery = await db.execute(sql`
      SELECT * FROM user_subscriptions 
      WHERE user_id = ${userId} 
      LIMIT 1
    `);
    const subscription = subscriptionQuery.rows && subscriptionQuery.rows.length > 0 ? subscriptionQuery.rows[0] : null;

    res.status(200).json({
      success: true,
      data: {
        subscription: {
          plan: "free",
          status: "cancelled",
          aiCredits: 100,
          enhancedTools: false,
          matchmakingBoost: false,
          projectVisibility: "standard",
          nextBillingDate: null,
          autoRenew: false,
          planFeatures: {
            aiCredits: 100,
            maxProjects: 3,
            maxApplications: 10,
            supportLevel: "community",
            analytics: false,
            customBranding: false,
          },
        },
      },
    });
  } catch (error) {
    console.error("Cancel subscription error:", error);
    next(new HttpException(500, error.message || "Failed to cancel subscription"));
  }
};

/**
 * Create dispute
 * POST /api/v1/user/billing/disputes
 */
const createDispute = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { billingHistoryId, amount, reason, description } = req.body;

    if (!amount || !reason) {
      return next(new HttpException(400, "Amount and reason are required"));
    }

    const dispute = await DisputesModel.createDispute({
      userId,
      billingHistoryId: billingHistoryId || null,
      amount: amount.toString(),
      reason,
      description: description || null,
      status: "pending",
      priority: parseFloat(amount) > 50 ? "high" : "medium",
    });

    res.status(201).json({
      success: true,
      data: {
        id: dispute.id,
        userId: dispute.userId,
        amount: parseFloat(dispute.amount),
        reason: dispute.reason,
        description: dispute.description,
        status: dispute.status,
        priority: dispute.priority,
        createdAt: dispute.createdAt.toISOString().split('T')[0],
      },
    });
  } catch (error) {
    console.error("Create dispute error:", error);
    next(new HttpException(500, error.message || "Failed to create dispute"));
  }
};

/**
 * Get disputes (admin only)
 * GET /api/v1/user/billing/disputes
 */
const getDisputes = async (req, res, next) => {
  try {
    const userRole = req.user.role;
    const { status } = req.query;

    if (userRole !== "admin") {
      return next(new HttpException(403, "Admin access required"));
    }

    const disputes = await DisputesModel.getAllDisputes(status || null, 100);

    const formatted = await Promise.all(
      disputes.map(async (dispute) => {
        const user = await getUserInfo(dispute.userId);
        return {
          id: dispute.id,
          userId: dispute.userId,
          userName: user?.name || `User ${dispute.userId}`,
          email: user?.email || null,
          amount: parseFloat(dispute.amount),
          reason: dispute.reason,
          description: dispute.description,
          status: dispute.status,
          priority: dispute.priority,
          resolution: dispute.resolution,
          resolvedAt: dispute.resolvedAt ? dispute.resolvedAt.toISOString().split('T')[0] : null,
          createdAt: dispute.createdAt.toISOString().split('T')[0],
        };
      })
    );

    res.status(200).json({
      success: true,
      data: formatted,
    });
  } catch (error) {
    console.error("Get disputes error:", error);
    next(new HttpException(500, error.message || "Failed to fetch disputes"));
  }
};

/**
 * Resolve dispute (admin only)
 * PUT /api/v1/user/billing/disputes/:id/resolve
 */
const resolveDispute = async (req, res, next) => {
  try {
    const userRole = req.user.role;
    const adminId = req.user.userId;
    const { id } = req.params;
    const { resolution } = req.body;

    if (userRole !== "admin") {
      return next(new HttpException(403, "Admin access required"));
    }

    if (!resolution) {
      return next(new HttpException(400, "Resolution is required"));
    }

    const dispute = await DisputesModel.resolveDispute(parseInt(id), adminId, resolution);

    res.status(200).json({
      success: true,
      data: {
        id: dispute.id,
        status: dispute.status,
        resolution: dispute.resolution,
        resolvedAt: dispute.resolvedAt.toISOString().split('T')[0],
      },
    });
  } catch (error) {
    console.error("Resolve dispute error:", error);
    next(new HttpException(500, error.message || "Failed to resolve dispute"));
  }
};

/**
 * Get suspended accounts (admin only)
 * GET /api/v1/user/billing/suspended-accounts
 */
const getSuspendedAccounts = async (req, res, next) => {
  try {
    const userRole = req.user.role;

    if (userRole !== "admin") {
      return next(new HttpException(403, "Admin access required"));
    }

    const accounts = await SuspendedAccountsModel.getAllSuspendedAccounts(100);

    const formatted = await Promise.all(
      accounts.map(async (account) => {
        const user = await getUserInfo(account.userId);
        return {
          id: account.id,
          userId: account.userId,
          userName: user?.name || `User ${account.userId}`,
          email: user?.email || null,
          reason: account.reason,
          amount: account.amount ? parseFloat(account.amount) : null,
          daysOverdue: account.daysOverdue,
          status: account.status,
          suspendedAt: account.suspendedAt.toISOString().split('T')[0],
        };
      })
    );

    res.status(200).json({
      success: true,
      data: formatted,
    });
  } catch (error) {
    console.error("Get suspended accounts error:", error);
    next(new HttpException(500, error.message || "Failed to fetch suspended accounts"));
  }
};

/**
 * Suspend account (admin only)
 * POST /api/v1/user/billing/suspended-accounts
 */
const suspendAccount = async (req, res, next) => {
  try {
    const userRole = req.user.role;
    const adminId = req.user.userId;
    const { userId, reason, amount, daysOverdue, notes } = req.body;

    if (userRole !== "admin") {
      return next(new HttpException(403, "Admin access required"));
    }

    if (!userId || !reason) {
      return next(new HttpException(400, "User ID and reason are required"));
    }

    const account = await SuspendedAccountsModel.createSuspendedAccount({
      userId: parseInt(userId),
      reason,
      amount: amount ? amount.toString() : null,
      daysOverdue: daysOverdue || 0,
      status: "suspended",
      suspendedBy: adminId,
      notes: notes || null,
    });

    res.status(201).json({
      success: true,
      data: {
        id: account.id,
        userId: account.userId,
        reason: account.reason,
        amount: account.amount ? parseFloat(account.amount) : null,
        daysOverdue: account.daysOverdue,
        status: account.status,
        suspendedAt: account.suspendedAt.toISOString().split('T')[0],
      },
    });
  } catch (error) {
    console.error("Suspend account error:", error);
    next(new HttpException(500, error.message || "Failed to suspend account"));
  }
};

/**
 * Unsuspend account (admin only)
 * PUT /api/v1/user/billing/suspended-accounts/:id/unsuspend
 */
const unsuspendAccount = async (req, res, next) => {
  try {
    const userRole = req.user.role;
    const adminId = req.user.userId;
    const { id } = req.params;

    if (userRole !== "admin") {
      return next(new HttpException(403, "Admin access required"));
    }

    const account = await SuspendedAccountsModel.unsuspendAccount(parseInt(id), adminId);

    res.status(200).json({
      success: true,
      data: {
        id: account.id,
        status: account.status,
        unsuspendedAt: account.unsuspendedAt.toISOString().split('T')[0],
      },
    });
  } catch (error) {
    console.error("Unsuspend account error:", error);
    next(new HttpException(500, error.message || "Failed to unsuspend account"));
  }
};

/**
 * Get admin billing dashboard data
 * GET /api/v1/user/billing/admin/dashboard
 */
const getAdminDashboard = async (req, res, next) => {
  try {
    const userRole = req.user.role;

    if (userRole !== "admin") {
      return next(new HttpException(403, "Admin access required"));
    }

    const adminData = await getAdminBillingData();

    res.status(200).json({
      success: true,
      data: adminData,
    });
  } catch (error) {
    console.error("Get admin dashboard error:", error);
    next(new HttpException(500, error.message || "Failed to fetch admin dashboard data"));
  }
};

// Helper functions removed - now using database queries via SubscriptionPlansModel

async function getAdminBillingData() {
  try {
    // Get total revenue from billing history
    const revenueQuery = await db.execute(sql`
      SELECT COALESCE(SUM(amount::numeric), 0) as total_revenue
      FROM billing_history
      WHERE status = 'completed'
    `);
    const totalRevenue = parseFloat(revenueQuery.rows[0]?.total_revenue || 0);

    // Get active subscriptions count
    const subscriptionsQuery = await db.execute(sql`
      SELECT COUNT(*) as count
      FROM user_subscriptions
      WHERE status = 'active'
    `);
    const activeSubscriptions = parseInt(subscriptionsQuery.rows[0]?.count || 0);

    // Get pending payments
    const pendingQuery = await db.execute(sql`
      SELECT COUNT(*) as count
      FROM billing_history
      WHERE status = 'pending'
    `);
    const pendingPayments = parseInt(pendingQuery.rows[0]?.count || 0);

    // Get disputes
    const disputes = await DisputesModel.getAllDisputes(null, 100);

    // Get suspended accounts
    const suspendedAccounts = await SuspendedAccountsModel.getAllSuspendedAccounts(100);

    // Calculate monthly recurring revenue (simplified)
    const monthlyRecurringRevenue = activeSubscriptions * 29.99; // Average plan price

    return {
      totalRevenue,
      activeSubscriptions,
      pendingPayments,
      monthlyRecurringRevenue,
      churnRate: 2.5, // Would calculate from actual data
      averageRevenuePerUser: activeSubscriptions > 0 ? totalRevenue / activeSubscriptions : 0,
      revenueGrowth: 12.5, // Would calculate from historical data
      subscriptionBreakdown: {
        free: Math.floor(activeSubscriptions * 0.68),
        premium: Math.floor(activeSubscriptions * 0.28),
        enterprise: Math.floor(activeSubscriptions * 0.04),
      },
      disputes: disputes.map(d => ({
        id: d.id,
        userId: d.userId,
        amount: parseFloat(d.amount),
        reason: d.reason,
        status: d.status,
        priority: d.priority,
        createdAt: d.createdAt.toISOString().split('T')[0],
      })),
      suspendedAccounts: suspendedAccounts.map(a => ({
        id: a.id,
        userId: a.userId,
        reason: a.reason,
        amount: a.amount ? parseFloat(a.amount) : null,
        suspendedAt: a.suspendedAt.toISOString().split('T')[0],
      })),
      recentTransactions: [], // Would fetch from billing_history
    };
  } catch (error) {
    console.error("Error getting admin billing data:", error);
    return {
      totalRevenue: 0,
      activeSubscriptions: 0,
      pendingPayments: 0,
      monthlyRecurringRevenue: 0,
      churnRate: 0,
      averageRevenuePerUser: 0,
      revenueGrowth: 0,
      subscriptionBreakdown: { free: 0, premium: 0, enterprise: 0 },
      disputes: [],
      suspendedAccounts: [],
      recentTransactions: [],
    };
  }
}

async function getProjectOwnerBillingData(userId) {
  try {
    // Get boosted projects from billing history
    const boostsQuery = await db.execute(sql`
      SELECT id, metadata, created_at, amount
      FROM billing_history
      WHERE user_id = ${userId} AND type = 'boost' AND status = 'completed'
      ORDER BY created_at DESC
      LIMIT 10
    `);

    const boostedProjects = boostsQuery.rows.map(boost => {
      const metadata = boost.metadata || {};
      return {
        id: metadata.projectId || boost.id,
        name: `Project ${metadata.projectId || boost.id}`,
        boostType: metadata.visibilityType || "premium",
        expiresAt: metadata.expiresAt ? new Date(metadata.expiresAt).toISOString().split('T')[0] : null,
        cost: parseFloat(boost.amount),
        purchasedAt: boost.created_at.toISOString().split('T')[0],
        status: "active",
      };
    });

    return {
      projectListings: [], // Would fetch from project service
      boostedProjects,
      premiumFeatures: [
        "Advanced Analytics Dashboard",
        "Priority Support (24/7)",
        "Custom Branding Options",
        "Enhanced Project Visibility",
        "AI-Powered Developer Matching",
        "Detailed Performance Metrics",
        "Export Reports",
      ],
      usageStats: {
        totalProjects: 0,
        activeProjects: 0,
        totalApplications: 0,
        totalViews: 0,
        averageMatchScore: 0,
      },
    };
  } catch (error) {
    console.error("Error getting project owner billing data:", error);
    return {
      projectListings: [],
      boostedProjects: [],
      premiumFeatures: [],
      usageStats: {
        totalProjects: 0,
        activeProjects: 0,
        totalApplications: 0,
        totalViews: 0,
        averageMatchScore: 0,
      },
    };
  }
}

module.exports = {
  getBillingData,
  purchaseSubscription,
  upgradeProjectVisibility,
  getPaymentMethods,
  addPaymentMethod,
  deletePaymentMethod,
  setDefaultPaymentMethod,
  getSubscriptionPlans,
  cancelSubscription,
  createDispute,
  getDisputes,
  resolveDispute,
  getSuspendedAccounts,
  suspendAccount,
  unsuspendAccount,
  getAdminDashboard,
};

