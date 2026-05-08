const express = require("express");
const router = express.Router();
const User = require("../models/User");

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password)
      return res.status(400).json({ message: "Username and password required" });

    const user = await User.findOne({ username });
    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ message: "Invalid username or password" });

    req.session.userId   = user._id;
    req.session.username = user.username;
    res.json({ message: "Login successful", username: user.username });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/auth/logout
router.post("/logout", (req, res) => {
  req.session.destroy(() => res.json({ message: "Logged out" }));
});

// GET /api/auth/me
router.get("/me", (req, res) => {
  if (req.session?.userId)
    return res.json({ loggedIn: true, username: req.session.username });
  res.json({ loggedIn: false });
});

module.exports = router;
