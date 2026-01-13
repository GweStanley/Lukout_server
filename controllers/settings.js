import User from "../models/User.js"; // assuming settings are part of user model

export const getSettings = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user.settings || {
      tone: "tone1.mp3",
      perimeter: 5,
      alertLifetime: 60,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const updateSettings = async (req, res) => {
  try {
    const { tone, perimeter, alertLifetime } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.settings = { tone, perimeter, alertLifetime };
    await user.save();

    res.json({ message: "Settings updated successfully", settings: user.settings });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
