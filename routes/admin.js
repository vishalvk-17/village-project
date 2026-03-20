const express = require("express");
const router = express.Router();
const { isLoggedIn, isAdmin, requireDatabase } = require("../middleware");
const Notice = require("../models/notice");
const Star = require("../models/star");
const User = require("../models/user");

router.get("/admin", requireDatabase, isLoggedIn, isAdmin, async (req, res) => {
  const notices = await Notice.find({}).sort({ createdAt: -1 });
  const stars = await Star.find({}).sort({ createdAt: -1 });
  const pendingVillagers = await User.find({ isApproved: false }).sort({ createdAt: -1 });

  res.render("admin/dashboard.ejs", { notices, stars, pendingVillagers });
});

router.post("/admin/notices", requireDatabase, isLoggedIn, isAdmin, async (req, res) => {
  const notice = new Notice({
    title: req.body.title?.trim(),
    description: req.body.description?.trim(),
    iconClass: req.body.iconClass?.trim() || "bi bi-megaphone text-primary"
  });

  await notice.save();
  req.flash("success", "Notice added successfully");
  res.redirect("/admin");
});

router.get("/admin/notices/:id/edit", requireDatabase, isLoggedIn, isAdmin, async (req, res) => {
  const notice = await Notice.findById(req.params.id);

  if (!notice) {
    req.flash("error", "Notice not found");
    return res.redirect("/admin");
  }

  res.render("admin/edit-notice.ejs", { notice });
});

router.put("/admin/notices/:id", requireDatabase, isLoggedIn, isAdmin, async (req, res) => {
  await Notice.findByIdAndUpdate(req.params.id, {
    title: req.body.title?.trim(),
    description: req.body.description?.trim(),
    iconClass: req.body.iconClass?.trim() || "bi bi-megaphone text-primary"
  });

  req.flash("success", "Notice updated successfully");
  res.redirect("/admin");
});

router.delete("/admin/notices/:id", requireDatabase, isLoggedIn, isAdmin, async (req, res) => {
  await Notice.findByIdAndDelete(req.params.id);
  req.flash("success", "Notice deleted successfully");
  res.redirect("/admin");
});

router.post("/admin/stars", requireDatabase, isLoggedIn, isAdmin, async (req, res) => {
  const star = new Star({
    name: req.body.name?.trim(),
    title: req.body.title?.trim(),
    description: req.body.description?.trim(),
    imageUrl: req.body.imageUrl?.trim() || "https://placehold.co/600x400?text=Village+Star",
    accentClass: req.body.accentClass?.trim() || "text-primary"
  });

  await star.save();
  req.flash("success", "Village star added successfully");
  res.redirect("/admin");
});

router.get("/admin/stars/:id/edit", requireDatabase, isLoggedIn, isAdmin, async (req, res) => {
  const star = await Star.findById(req.params.id);

  if (!star) {
    req.flash("error", "Village star not found");
    return res.redirect("/admin");
  }

  res.render("admin/edit-star.ejs", { star });
});

router.put("/admin/stars/:id", requireDatabase, isLoggedIn, isAdmin, async (req, res) => {
  await Star.findByIdAndUpdate(req.params.id, {
    name: req.body.name?.trim(),
    title: req.body.title?.trim(),
    description: req.body.description?.trim(),
    imageUrl: req.body.imageUrl?.trim() || "https://placehold.co/600x400?text=Village+Star",
    accentClass: req.body.accentClass?.trim() || "text-primary"
  });

  req.flash("success", "Village star updated successfully");
  res.redirect("/admin");
});

router.delete("/admin/stars/:id", requireDatabase, isLoggedIn, isAdmin, async (req, res) => {
  await Star.findByIdAndDelete(req.params.id);
  req.flash("success", "Village star removed successfully");
  res.redirect("/admin");
});

module.exports = router;
