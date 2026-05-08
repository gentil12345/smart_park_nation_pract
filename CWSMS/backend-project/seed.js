const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const User = require("./models/User");
const Package = require("./models/Package");

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB");

  // Seed admin user
  await User.deleteMany();
  await User.create({ username: "receptionist", password: "admin123" });
  console.log("User created: receptionist / admin123");

  // Seed packages
  await Package.deleteMany();
  await Package.insertMany([
    { PackageNumber: "PKG001", PackageName: "Basic wash",   PackageDescription: "Exterior hand wash",              PackagePrice: 5000  },
    { PackageNumber: "PKG002", PackageName: "Classic wash", PackageDescription: "Interior hand wash",              PackagePrice: 10000 },
    { PackageNumber: "PKG003", PackageName: "Premium wash", PackageDescription: "Exterior and Interior hand wash", PackagePrice: 20000 },
  ]);
  console.log("Packages seeded");

  await mongoose.disconnect();
  console.log("Done! Login: receptionist / admin123");
}

seed().catch(console.error);
