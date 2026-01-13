import express from "express";
import PushSubscription from "../models/PushSubscription.js";

const router = express.Router();

/**
 * CHECK IF USER IS ALREADY SUBSCRIBED
 */
router.get("/status", async (req, res) => {
  try {
    const count = await PushSubscription.countDocuments();
    res.json({ subscribed: count > 0 });
  } catch (err) {
    res.status(500).json({ error: "Failed to check status" });
  }
});

/**
 * SAVE PUSH SUBSCRIPTION
 */
router.post("/subscribe", async (req, res) => {
  try {
    const { endpoint, keys } = req.body;

    if (!endpoint || !keys) {
      return res.status(400).json({ error: "Invalid subscription" });
    }

    const exists = await PushSubscription.findOne({ endpoint });
    if (exists) {
      return res.json({ message: "Already subscribed" });
    }

    await PushSubscription.create({ endpoint, keys });
    res.json({ message: "Subscription saved" });
  } catch (err) {
    res.status(500).json({ error: "Subscription failed" });
  }
});

export default router;
