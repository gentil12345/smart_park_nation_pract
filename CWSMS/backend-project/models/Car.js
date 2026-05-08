const mongoose = require("mongoose");

const carSchema = new mongoose.Schema({
  PlateNumber: { type: String, required: true, unique: true, uppercase: true, trim: true },
  CarType:     { type: String, required: true, enum: ["Sedan", "SUV", "Truck", "Van", "Motorcycle", "Bus", "Other"] },
  CarSize:     { type: String, required: true, enum: ["Small", "Medium", "Large"] },
  DriverName:  { type: String, required: true, trim: true },
  PhoneNumber: { type: String, required: true, trim: true },
}, { timestamps: true });

module.exports = mongoose.model("Car", carSchema);
