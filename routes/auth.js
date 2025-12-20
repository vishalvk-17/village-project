// routes/auth.js
const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const bcrypt = require("bcryptjs");

// Show login form
router.get("/login", (req, res) => {
  res.render("villages/login.ejs");
});

// Handle login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).render("villages/login.ejs", { error: "Invalid email or password." });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).render("villages/login.ejs", { error: "Invalid email or password." });
    }

    req.session.user = {
      id: user._id.toString(),
      name: user.name,
      role: user.role
    };
    req.flash("success", "You have logged in successfully");
    res.redirect(`/${user._id}`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error during login");
  }
});

// Logout
router.get("/logout", (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error(err);
      return res.status(500).send("Logout error");
    }
    res.clearCookie("connect.sid");
    res.redirect("/");
  });
});

module.exports = router;
