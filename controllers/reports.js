import Report from "../models/Report.js";

export const submitReport = async (req, res) => {
  const { category, details, location } = req.body;

  const media = req.file ? req.file.filename : null;

  const report = await Report.create({
    userId: req.user._id,
    media,
    category,
    details,
    location,
  });

  res.json(report);
};

export const getReports = async (req, res) => {
  const reports = await Report.find().sort({ createdAt: -1 });
  res.json(reports);
};
