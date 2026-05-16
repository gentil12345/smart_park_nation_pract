const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const session = require("express-session");
const MongoStore = require("connect-mongo");

dotenv.config();

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5176",
  credentials: true,
}));
app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET || "cwsms_secret",
  resave: false,
  saveUninitialized: false,
  store: process.env.MONGO_URI
    ? MongoStore.create({ mongoUrl: process.env.MONGO_URI })
    : undefined, // falls back to MemoryStore in dev when no MONGO_URI
  cookie: { httpOnly: true, maxAge: 8 * 60 * 60 * 1000 }, // 8 hours
}));

// Routes
app.use("/api/auth",            require("./routes/auth"));
app.use("/api/cars",            require("./routes/cars"));
app.use("/api/packages",        require("./routes/packages"));
app.use("/api/service-packages",require("./routes/servicePackages"));
app.use("/api/payments",        require("./routes/payments"));

app.get("/api/health", (req, res) => res.json({ status: "ok", app: "CWSMS" }));

const PORT = process.env.PORT || 10000;

// Start server immediately so Render doesn't kill the process
app.listen(PORT, () =>
  console.log(`CWSMS Backend running on port ${PORT}`)
);

// Connect to MongoDB
if (!process.env.MONGO_URI) {
  console.error("ERROR: MONGO_URI environment variable is not set.");
} else {
  mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected — CWSMS database"))
    .catch((err) => console.error("DB connection error:", err));
}
