const express = require("express");
const router = express.Router();
const Car = require("../models/Car");
const { requireLogin } = require("../middleware/auth");

// GET all cars
router.get("/", requireLogin, async (req, res) => {
  try {
    const cars = await Car.find().sort({ createdAt: -1 });
    res.json(cars);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET single car
router.get("/:plate", requireLogin, async (req, res) => {
  try {
    const car = await Car.findOne({ PlateNumber: req.params.plate.toUpperCase() });
    if (!car) return res.status(404).json({ message: "Car not found" });
    res.json(car);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST create car
router.post("/", requireLogin, async (req, res) => {
  try {
    const car = await Car.create({
      ...req.body,
      PlateNumber: req.body.PlateNumber?.toUpperCase(),
    });
    res.status(201).json(car);
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ message: "Plate number already exists" });
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
