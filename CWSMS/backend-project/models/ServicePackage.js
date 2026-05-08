const mongoose = require("mongoose");

const servicePackageSchema = new mongoose.Schema({
  RecordNumber: { type: String, required: true, unique: true, trim: true },
  ServiceDate:  { type: Date, required: true, default: Date.now },
  // Foreign keys
  PlateNumber:  { type: String, required: true, ref: "Car" },
  PackageNumber:{ type: String, required: true, ref: "Package" },
}, { timestamps: true });

module.exports = mongoose.model("ServicePackage", servicePackageSchema);
