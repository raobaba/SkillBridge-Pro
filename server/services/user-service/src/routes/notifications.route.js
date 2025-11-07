const express = require("express");
const notificationsController = require("../controllers/notifications.controller");
const authenticate = require("shared/middleware/auth.middleware");

const notificationsRouter = express.Router();

// All notification routes
notificationsRouter.get("/", authenticate, notificationsController.getNotifications);
notificationsRouter.get("/unread-count", authenticate, notificationsController.getUnreadCount);
notificationsRouter.post("/", authenticate, notificationsController.createNotification);
notificationsRouter.put("/:notificationId/read", authenticate, notificationsController.markAsRead);
notificationsRouter.put("/read-all", authenticate, notificationsController.markAllAsRead);
notificationsRouter.delete("/:notificationId", authenticate, notificationsController.deleteNotification);
notificationsRouter.delete("/", authenticate, notificationsController.deleteAllNotifications);

module.exports = notificationsRouter;

