/**
 * Seed script — run once: node seed.js
 * Creates admin user + sample products
 */
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const User = require("./models/User");
const Product = require("./models/Product");

const products = [
  {
    name: "Wireless Noise-Cancelling Headphones",
    description: "Premium over-ear headphones with 30hr battery and active noise cancellation.",
    price: 79.99, originalPrice: 129.99, category: "Electronics", brand: "SoundMax",
    images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400"],
    stock: 50, featured: true, rating: 4.5, numReviews: 120, tags: ["audio", "wireless"],
  },
  {
    name: "Mechanical Gaming Keyboard",
    description: "RGB backlit mechanical keyboard with tactile switches and anti-ghosting.",
    price: 59.99, originalPrice: 89.99, category: "Electronics", brand: "KeyPro",
    images: ["https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400"],
    stock: 30, featured: true, rating: 4.7, numReviews: 85, tags: ["gaming", "keyboard"],
  },
  {
    name: "Men's Classic Fit T-Shirt",
    description: "100% cotton premium t-shirt, available in multiple colors.",
    price: 19.99, originalPrice: 29.99, category: "Clothing", brand: "UrbanWear",
    images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400"],
    stock: 200, featured: false, rating: 4.2, numReviews: 340, tags: ["casual", "cotton"],
  },
  {
    name: "Running Shoes Pro",
    description: "Lightweight breathable running shoes with cushioned sole.",
    price: 89.99, originalPrice: 119.99, category: "Sports", brand: "SpeedRun",
    images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400"],
    stock: 75, featured: true, rating: 4.6, numReviews: 210, tags: ["running", "shoes"],
  },
  {
    name: "JavaScript: The Good Parts",
    description: "Essential guide to the best features of JavaScript by Douglas Crockford.",
    price: 24.99, originalPrice: 34.99, category: "Books", brand: "O'Reilly",
    images: ["https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400"],
    stock: 100, featured: false, rating: 4.8, numReviews: 560, tags: ["javascript", "programming"],
  },
  {
    name: "Smart LED Desk Lamp",
    description: "Touch-controlled LED lamp with adjustable brightness and color temperature.",
    price: 34.99, originalPrice: 49.99, category: "Home", brand: "LumiHome",
    images: ["https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400"],
    stock: 60, featured: true, rating: 4.4, numReviews: 95, tags: ["lamp", "smart"],
  },
  {
    name: "Yoga Mat Premium",
    description: "Non-slip eco-friendly yoga mat, 6mm thick with carrying strap.",
    price: 29.99, originalPrice: 44.99, category: "Sports", brand: "ZenFit",
    images: ["https://images.unsplash.com/photo-1601925228008-f5e4c5e5e5e5?w=400"],
    stock: 80, featured: false, rating: 4.3, numReviews: 175, tags: ["yoga", "fitness"],
  },
  {
    name: "Vitamin C Serum",
    description: "Brightening face serum with 20% Vitamin C, hyaluronic acid and niacinamide.",
    price: 22.99, originalPrice: 39.99, category: "Beauty", brand: "GlowLab",
    images: ["https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400"],
    stock: 120, featured: true, rating: 4.5, numReviews: 430, tags: ["skincare", "vitamin-c"],
  },
  {
    name: "4K Webcam",
    description: "Ultra HD webcam with built-in mic, autofocus and low-light correction.",
    price: 69.99, originalPrice: 99.99, category: "Electronics", brand: "ClearVision",
    images: ["https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=400"],
    stock: 40, featured: false, rating: 4.4, numReviews: 67, tags: ["webcam", "streaming"],
  },
  {
    name: "Stainless Steel Water Bottle",
    description: "Insulated 32oz bottle keeps drinks cold 24hrs or hot 12hrs.",
    price: 18.99, originalPrice: 27.99, category: "Sports", brand: "HydroFlow",
    images: ["https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400"],
    stock: 150, featured: false, rating: 4.6, numReviews: 290, tags: ["hydration", "bottle"],
  },
  {
    name: "Wireless Charging Pad",
    description: "15W fast wireless charger compatible with all Qi-enabled devices.",
    price: 15.99, originalPrice: 24.99, category: "Electronics", brand: "ChargeFast",
    images: ["https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400"],
    stock: 90, featured: false, rating: 4.1, numReviews: 145, tags: ["charging", "wireless"],
  },
  {
    name: "Lego Architecture Set",
    description: "Build iconic skylines with this 560-piece architecture collection.",
    price: 49.99, originalPrice: 64.99, category: "Toys", brand: "Lego",
    images: ["https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400"],
    stock: 35, featured: true, rating: 4.9, numReviews: 380, tags: ["lego", "building"],
  },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB");

  await Product.deleteMany();
  await User.deleteMany();

  await Product.insertMany(products);
  console.log(`Seeded ${products.length} products`);

  await User.create({ name: "Admin User", email: "admin@shop.com", password: "admin123", role: "admin" });
  await User.create({ name: "Jane Doe", email: "jane@shop.com", password: "user123", role: "user" });
  console.log("Seeded users: admin@shop.com / admin123  |  jane@shop.com / user123");

  await mongoose.disconnect();
  console.log("Done!");
}

seed().catch(console.error);
