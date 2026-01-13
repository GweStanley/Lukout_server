import express from "express";
import Alert from "../models/Alert.js";
import authMiddleware from "../middleware/auth.js";
import PushSubscription from "../models/PushSubscription.js";
import webPush from "../utils/push.js";


const router = express.Router();

// GET all active alerts (exclude expired)
router.get("/", authMiddleware, async (req, res) => {
  try {
    const now = new Date();
    const alerts = await Alert.find({ expiresAt: { $gt: now } }).sort({ createdAt: -1 });
    res.json(Array.isArray(alerts) ? alerts : []);
  } catch (err) {
    console.error("Error fetching alerts:", err);
    res.status(500).json([]);
  }
});

// POST new alert
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { type, additionalInfo, location, imageUrl } = req.body;

    if (!type || !location?.lat || !location?.lng) {
      return res.status(400).json({ message: "Type and location are required" });
    }

    const alert = await Alert.create({
      type,
      additionalInfo: additionalInfo || "",
      location,
      imageUrl: imageUrl || "",
      feedback: [],
      isActive: true,
      expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000),
    });

    // 🔔 PUSH NOTIFICATIONS (NON-BLOCKING)
    try {
      const subscriptions = await PushSubscription.find();

      const payload = JSON.stringify({
        title: "🚨 New Emergency Alert",
        body: `${type} reported near you`,
        icon: "/icons/icon-192.png",
        data: {
          url: "/main/feed",
          alertId: alert._id,
        },
      });

      subscriptions.forEach((sub) => {
        webPush
          .sendNotification(sub.subscription, payload)
          .catch(() => {
            // fail silently – do not affect alert creation
          });
      });
    } catch (pushErr) {
      console.error("Push notification error:", pushErr);
    }

    res.status(201).json(alert);
  } catch (err) {
    console.error("Error creating alert:", err);
    res.status(500).json({ message: "Failed to create alert" });
  }
});

// POST feedback for existing alert
router.post("/feedback/:alertId", authMiddleware, async (req, res) => {
  try {
    const { alertId } = req.params;
    const { message } = req.body;

    if (!message) return res.status(400).json({ message: "Feedback message is required" });

    const alert = await Alert.findById(alertId);
    if (!alert) return res.status(404).json({ message: "Alert not found" });

    alert.feedback.push({
      user: req.user._id,
      message,
      createdAt: new Date(),
    });

    await alert.save();
    res.json(alert);
  } catch (err) {
    console.error("Error adding feedback:", err);
    res.status(500).json({ message: "Failed to add feedback" });
  }
});

export default router;
