import express from "express";
import multer from "multer";
import { submitReport } from "../controllers/reports.js";
import protect from "../middleware/auth.js";   // ADD THIS LINE ✔

const router = express.Router();

// Multer Upload Setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// Routes
router.post("/submit", protect, upload.single("media"), submitReport);

export default router;
