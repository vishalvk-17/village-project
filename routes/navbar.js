// routes/pages.js
const express = require("express");
const router = express.Router();

// About route
router.get("/about", (req, res) => {
  res.render("villages/about.ejs");
});

// Community route
router.get("/community", (req, res) => {
  const members = [
    { name: "हरिओम राजपूत", role: "प्रधान", image: "https://plus.unsplash.com/premium_photo-1691030254390-aa56b22e6a45?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0" },
    { name: "राहुल राजपूत", role: "सचिव", image: "https://images.unsplash.com/photo-1729157661483-ed21901ed892?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0" },
    { name: "मोहन", role: "कोषाध्यक्ष", image: "https://images.unsplash.com/photo-1581382575275-97901c2635b7?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0" }
  ];
  res.render("villages/community.ejs", { members });
});

module.exports = router;