const mongoose = require("mongoose");

const packageSchema = new mongoose.Schema({
  PackageNumber: { type: String, required: true, unique: true, trim: true },
  PackageName:   { type: String, required: true, trim: true },
  PackageDescription: { type: String, required: true },
  PackagePrice:  { type: Number, required: true, min: 0 },
}, { timestamps: true });

module.exports = mongoose.model("Package", packageSchema);
