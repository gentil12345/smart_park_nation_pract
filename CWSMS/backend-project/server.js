const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const session = require("express-session");

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
  cookie: { httpOnly: true, maxAge: 8 * 60 * 60 * 1000 }, // 8 hours
}));

// Routes
app.use("/api/auth",            require("./routes/auth"));
app.use("/api/cars",            require("./routes/cars"));
app.use("/api/packages",        require("./routes/packages"));
app.use("/api/service-packages",require("./routes/servicePackages"));
app.use("/api/payments",        require("./routes/payments"));

app.get("/api/health", (req, res) => res.json({ status: "ok", app: "CWSMS" }));

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected — CWSMS database");
    app.listen(process.env.PORT, () =>
      console.log(`CWSMS Backend running on http://localhost:${process.env.PORT}`)
    );
  })
  .catch((err) => console.error("DB Error:", err));
