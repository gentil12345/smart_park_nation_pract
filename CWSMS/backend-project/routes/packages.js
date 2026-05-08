const express = require("express");
const router = express.Router();
const Package = require("../models/Package");
const { requireLogin } = require("../middleware/auth");

// GET all packages
router.get("/", requireLogin, async (req, res) => {
  try {
    const packages = await Package.find().sort({ PackageNumber: 1 });
    res.json(packages);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST create package
router.post("/", requireLogin, async (req, res) => {
  try {
    const pkg = await Package.create(req.body);
    res.status(201).json(pkg);
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ message: "Package number already exists" });
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
