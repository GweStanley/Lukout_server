import Alert from "../models/Alert.js";
import Subscription from "../models/Subscription.js";
import { sendNotification } from "../utils/notifications.js";


// Send a new alert
export const sendAlert = async (req, res) => {
  try {
    const { type, additionalInfo, imageUrl, location } = req.body;

    const alert = await Alert.create({
      userId: req.user._id,
      type,
      additionalInfo,
      imageUrl,
      location,
      expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000), // 48 hours
      isActive: true,
    });

    res.status(201).json(alert);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create alert" });
  }
};

// after saving the alert
const subscriptions = await Subscription.find({});
subscriptions.forEach((sub) => {
  sendNotification(sub.subscription, {
    title: "New Alert!",
    body: `${alert.type}: ${alert.additionalInfo || "Check the alert details"}`,
    url: `/main/alerts/${alert._id}`,
  });
});

// Get all active alerts (not expired)
export const getAlerts = async (req, res) => {
  try {
    const now = new Date();
    const alerts = await Alert.find({
      isActive: true,
      expiresAt: { $gt: now },
    }).sort({ createdAt: -1 });

    res.json(alerts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch alerts" });
  }
};

// Add feedback to an existing alert
export const addFeedback = async (req, res) => {
  try {
    const { alertId, message } = req.body;

    if (!alertId || !message) {
      return res.status(400).json({ message: "Alert ID and message are required" });
    }

    const alert = await Alert.findById(alertId);
    if (!alert) return res.status(404).json({ message: "Alert not found" });

    // Push new feedback
    alert.feedback.push({
      message,
      user: req.user._id,
    });


    // Optionally renew alert expiration when feedback added
    alert.expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000);

    await alert.save();
    res.json(alert);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to add feedback" });
  }
};
