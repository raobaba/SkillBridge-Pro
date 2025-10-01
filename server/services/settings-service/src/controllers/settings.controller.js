const HttpException = require("shared/utils/HttpException.utils");
const {
  UserNotificationSettingsModel,
  UserNotificationFrequencyModel,
  UserQuietHoursModel,
  UserPrivacySettingsModel,
  UserIntegrationsModel,
  UserSubscriptionsModel,
} = require("../models");

const resolveUserId = (req) => {
  if (req.user?.id) return Number(req.user.id);
  if (req.headers["x-user-id"]) return Number(req.headers["x-user-id"]);
  if (req.query.userId) return Number(req.query.userId);
  return null;
};

// ---------- Notification Settings (toggles)
async function getNotificationSettings(req, res, next) {
  try {
    const userId = resolveUserId(req);
    if (!userId) throw new HttpException(400, "userId is required");
    const row = await UserNotificationSettingsModel.getByUserId(userId);
    res.json({ success: true, data: row || null });
  } catch (err) {
    next(err);
  }
}

async function upsertNotificationSettings(req, res, next) {
  try {
    const userId = resolveUserId(req);
    if (!userId) throw new HttpException(400, "userId is required");
    const payload = req.body || {};
    const row = await UserNotificationSettingsModel.upsertByUserId(userId, payload);
    res.json({ success: true, data: row });
  } catch (err) {
    next(err);
  }
}

// ---------- Notification Frequency
async function getNotificationFrequency(req, res, next) {
  try {
    const userId = resolveUserId(req);
    if (!userId) throw new HttpException(400, "userId is required");
    const row = await UserNotificationFrequencyModel.getByUserId(userId);
    res.json({ success: true, data: row || null });
  } catch (err) {
    next(err);
  }
}

async function upsertNotificationFrequency(req, res, next) {
  try {
    const userId = resolveUserId(req);
    if (!userId) throw new HttpException(400, "userId is required");
    const payload = req.body || {};
    const row = await UserNotificationFrequencyModel.upsertByUserId(userId, payload);
    res.json({ success: true, data: row });
  } catch (err) {
    next(err);
  }
}

// ---------- Quiet Hours
async function getQuietHours(req, res, next) {
  try {
    const userId = resolveUserId(req);
    if (!userId) throw new HttpException(400, "userId is required");
    const row = await UserQuietHoursModel.getByUserId(userId);
    res.json({ success: true, data: row || null });
  } catch (err) {
    next(err);
  }
}

async function upsertQuietHours(req, res, next) {
  try {
    const userId = resolveUserId(req);
    if (!userId) throw new HttpException(400, "userId is required");
    const payload = req.body || {};
    const row = await UserQuietHoursModel.upsertByUserId(userId, payload);
    res.json({ success: true, data: row });
  } catch (err) {
    next(err);
  }
}

// ---------- Privacy
async function getPrivacySettings(req, res, next) {
  try {
    const userId = resolveUserId(req);
    if (!userId) throw new HttpException(400, "userId is required");
    const row = await UserPrivacySettingsModel.getByUserId(userId);
    res.json({ success: true, data: row || null });
  } catch (err) {
    next(err);
  }
}

async function upsertPrivacySettings(req, res, next) {
  try {
    const userId = resolveUserId(req);
    if (!userId) throw new HttpException(400, "userId is required");
    const payload = req.body || {};
    const row = await UserPrivacySettingsModel.upsertByUserId(userId, payload);
    res.json({ success: true, data: row });
  } catch (err) {
    next(err);
  }
}

// ---------- Integrations
async function getIntegrations(req, res, next) {
  try {
    const userId = resolveUserId(req);
    if (!userId) throw new HttpException(400, "userId is required");
    const row = await UserIntegrationsModel.getByUserId(userId);
    res.json({ success: true, data: row || null });
  } catch (err) {
    next(err);
  }
}

async function upsertIntegrations(req, res, next) {
  try {
    const userId = resolveUserId(req);
    if (!userId) throw new HttpException(400, "userId is required");
    const payload = req.body || {};
    const now = new Date();

    // Auto-populate connectedAt timestamps on boolean connect/disconnect changes
    const existing = await UserIntegrationsModel.getByUserId(userId);
    const computed = { ...payload };
    if (payload.github !== undefined && (!existing || existing.github !== payload.github)) {
      computed.githubConnectedAt = payload.github ? now : null;
    }
    if (payload.linkedin !== undefined && (!existing || existing.linkedin !== payload.linkedin)) {
      computed.linkedinConnectedAt = payload.linkedin ? now : null;
    }
    if (payload.googleCalendar !== undefined && (!existing || existing.googleCalendar !== payload.googleCalendar)) {
      computed.googleCalendarConnectedAt = payload.googleCalendar ? now : null;
    }

    const row = await UserIntegrationsModel.upsertByUserId(userId, computed);
    res.json({ success: true, data: row });
  } catch (err) {
    next(err);
  }
}

// ---------- Subscription (as surfaced in Settings)
async function getSubscription(req, res, next) {
  try {
    const userId = resolveUserId(req);
    if (!userId) throw new HttpException(400, "userId is required");
    const row = await UserSubscriptionsModel.getByUserId(userId);
    res.json({ success: true, data: row || null });
  } catch (err) {
    next(err);
  }
}

async function upsertSubscription(req, res, next) {
  try {
    const userId = resolveUserId(req);
    if (!userId) throw new HttpException(400, "userId is required");
    const payload = req.body || {};
    const row = await UserSubscriptionsModel.upsertByUserId(userId, payload);
    res.json({ success: true, data: row });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getNotificationSettings,
  upsertNotificationSettings,
  getNotificationFrequency,
  upsertNotificationFrequency,
  getQuietHours,
  upsertQuietHours,
  getPrivacySettings,
  upsertPrivacySettings,
  getIntegrations,
  upsertIntegrations,
  getSubscription,
  upsertSubscription,
};


