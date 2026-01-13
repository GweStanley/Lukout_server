import express from "express";
import User from "../models/User.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

// GET user settings
router.get("/", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("settings");
    res.json(user.settings || {
      tone: "/audio/tone1.mp3",
      perimeter: 10,
      alertLifetime: 10,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      tone: "/audio/tone1.mp3",
      perimeter: 10,
      alertLifetime: 10,
    });
  }
});

// UPDATE user settings
router.put("/", authMiddleware, async (req, res) => {
  const { tone, perimeter, alertLifetime } = req.body;
  try {
    const user = await User.findById(req.user.id);
    user.settings = { tone, perimeter, alertLifetime };
    await user.save();
    res.json(user.settings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error – unable to save" });
  }
});

export default router;
