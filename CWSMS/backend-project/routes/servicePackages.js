const express = require("express");
const router = express.Router();
const ServicePackage = require("../models/ServicePackage");
const Car = require("../models/Car");
const Package = require("../models/Package");
const { requireLogin } = require("../middleware/auth");

// Helper: populate service record with car + package details
async function populate(record) {
  const car = await Car.findOne({ PlateNumber: record.PlateNumber });
  const pkg = await Package.findOne({ PackageNumber: record.PackageNumber });
  return { ...record.toObject(), car, package: pkg };
}

// GET all service records
router.get("/", requireLogin, async (req, res) => {
  try {
    const records = await ServicePackage.find().sort({ createdAt: -1 });
    const populated = await Promise.all(records.map(populate));
    res.json(populated);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET single
router.get("/:id", requireLogin, async (req, res) => {
  try {
    const record = await ServicePackage.findById(req.params.id);
    if (!record) return res.status(404).json({ message: "Record not found" });
    res.json(await populate(record));
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST create
router.post("/", requireLogin, async (req, res) => {
  try {
    const record = await ServicePackage.create(req.body);
    res.status(201).json(await populate(record));
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ message: "Record number already exists" });
    res.status(400).json({ message: err.message });
  }
});

// PUT update
router.put("/:id", requireLogin, async (req, res) => {
  try {
    const record = await ServicePackage.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!record) return res.status(404).json({ message: "Record not found" });
    res.json(await populate(record));
  } catch (err) { res.status(400).json({ message: err.message }); }
});

// DELETE
router.delete("/:id", requireLogin, async (req, res) => {
  try {
    const record = await ServicePackage.findByIdAndDelete(req.params.id);
    if (!record) return res.status(404).json({ message: "Record not found" });
    res.json({ message: "Deleted successfully" });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
