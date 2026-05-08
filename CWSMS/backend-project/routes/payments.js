const express = require("express");
const router = express.Router();
const Payment = require("../models/Payment");
const ServicePackage = require("../models/ServicePackage");
const Car = require("../models/Car");
const Package = require("../models/Package");
const { requireLogin } = require("../middleware/auth");

async function populate(payment) {
  const service = await ServicePackage.findOne({ RecordNumber: payment.RecordNumber });
  let car = null, pkg = null;
  if (service) {
    car = await Car.findOne({ PlateNumber: service.PlateNumber });
    pkg = await Package.findOne({ PackageNumber: service.PackageNumber });
  }
  return { ...payment.toObject(), service, car, package: pkg };
}

// GET all payments
router.get("/", requireLogin, async (req, res) => {
  try {
    const payments = await Payment.find().sort({ createdAt: -1 });
    const populated = await Promise.all(payments.map(populate));
    res.json(populated);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST create payment
router.post("/", requireLogin, async (req, res) => {
  try {
    const payment = await Payment.create(req.body);
    res.status(201).json(await populate(payment));
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ message: "Payment number already exists" });
    res.status(400).json({ message: err.message });
  }
});

// GET daily report
router.get("/report/daily", requireLogin, async (req, res) => {
  try {
    const { date } = req.query;
    let start, end;
    if (date) {
      start = new Date(date); start.setHours(0, 0, 0, 0);
      end   = new Date(date); end.setHours(23, 59, 59, 999);
    } else {
      start = new Date(); start.setHours(0, 0, 0, 0);
      end   = new Date(); end.setHours(23, 59, 59, 999);
    }

    const payments = await Payment.find({ PaymentDate: { $gte: start, $lte: end } }).sort({ PaymentDate: 1 });
    const populated = await Promise.all(payments.map(populate));

    const totalAmount = payments.reduce((sum, p) => sum + p.AmountPaid, 0);
    res.json({ date: start.toISOString().split("T")[0], records: populated, totalAmount, count: payments.length });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
