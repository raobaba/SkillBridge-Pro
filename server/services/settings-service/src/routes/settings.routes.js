const express = require("express");
const router = express.Router();
const auth = require("shared/middleware/auth.middleware");
const {
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
} = require("../controllers/settings.controller");

// Base: /api/v1/settings
// All routes require authentication
router.use(auth);

router.get("/notifications", getNotificationSettings);
router.put("/notifications", upsertNotificationSettings);

router.get("/notifications/frequency", getNotificationFrequency);
router.put("/notifications/frequency", upsertNotificationFrequency);

router.get("/quiet-hours", getQuietHours);
router.put("/quiet-hours", upsertQuietHours);

router.get("/privacy", getPrivacySettings);
router.put("/privacy", upsertPrivacySettings);

router.get("/integrations", getIntegrations);
router.put("/integrations", upsertIntegrations);

router.get("/subscription", getSubscription);
router.put("/subscription", upsertSubscription);

module.exports = router;


