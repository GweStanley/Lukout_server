import mongoose from "mongoose";

const FeedbackSchema = new mongoose.Schema(
  {
    message: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const AlertSchema = new mongoose.Schema(
  {
    type: { type: String, required: true },
    additionalInfo: { type: String, default: "" },
    imageUrl: { type: String, default: "" },
    location: {
      lat: Number,
      lng: Number,
    },
    feedback: { type: [FeedbackSchema], default: [] },
    isActive: { type: Boolean, default: true },
    expiresAt: Date,
  },
  { timestamps: true }
);

// ✅ SAFE HOOK
AlertSchema.pre("validate", function () {
  if (!this.expiresAt) {
    this.expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000);
  }
});

export default mongoose.model("Alert", AlertSchema);
