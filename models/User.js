import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, default: "" },
  phone: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  jurisdiction: { type: String, required: true },
  settings: {
    tone: { type: String, default: "tone1.mp3" },
    perimeter: { type: Number, default: 5 },
    alertLifetime: { type: Number, default: 60 },
  },
}, { timestamps: true });

export default mongoose.models.User || mongoose.model("User", userSchema);
