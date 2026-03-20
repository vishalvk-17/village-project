const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Family = require("../models/family.js");
const User = require("../models/user.js");
const { isLoggedIn } = require("../middleware");

function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

async function loadFamilyMembers() {
  return User.find({
    $or: [
      { isApproved: true },
      { isApproved: { $exists: false } }
    ]
  })
    .select("name profession village")
    .sort({ name: 1 });
}

function normalizeMembers(members) {
  if (Array.isArray(members)) return members;
  if (members) return [members];
  return [];
}

function buildFamilyPayload(body) {
  return {
    headName: body.headName?.trim(),
    familyNote: body.familyNote?.trim(),
    address: {
      line1: body.address?.line1?.trim(),
      village: body.address?.village?.trim() || "Bhilkheda",
      district: body.address?.district?.trim(),
      state: body.address?.state?.trim(),
      pincode: body.address?.pincode?.trim()
    },
    members: normalizeMembers(body.members)
  };
}

router.get("/new", isLoggedIn, async (req, res) => {
  const villagers = await loadFamilyMembers();
  res.render("villages/create-family.ejs", { villagers });
});

router.post("/", isLoggedIn, async (req, res) => {
  const savedFamily = await new Family(buildFamilyPayload(req.body)).save();
  req.flash("success", "Family added successfully");
  res.redirect(`/families/${savedFamily._id}`);
});

router.get("/", async (req, res) => {
  const search = req.query.search?.trim() || "";
  const filters = {};

  if (search) {
    filters.$or = [
      { headName: { $regex: search, $options: "i" } },
      { "address.village": { $regex: search, $options: "i" } },
      { "address.district": { $regex: search, $options: "i" } }
    ];
  }

  const families = await Family.find(filters)
    .populate("members", "name profession")
    .sort({ createdAt: -1 });

  res.render("villages/families.ejs", { families, search });
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    req.flash("error", "Family not found");
    return res.redirect("/families");
  }

  const family = await Family.findById(id).populate("members", "name profession village");

  if (!family) {
    req.flash("error", "Family not found");
    return res.redirect("/families");
  }

  res.render("villages/family-info.ejs", { family });
});

router.get("/:id/edit", isLoggedIn, async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    req.flash("error", "Family not found");
    return res.redirect("/families");
  }

  const [family, villagers] = await Promise.all([
    Family.findById(id),
    loadFamilyMembers()
  ]);

  if (!family) {
    req.flash("error", "Family not found");
    return res.redirect("/families");
  }

  res.render("villages/edit-family.ejs", { family, villagers });
});

router.put("/:id", isLoggedIn, async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    req.flash("error", "Family not found");
    return res.redirect("/families");
  }

  const updated = await Family.findByIdAndUpdate(id, buildFamilyPayload(req.body), { new: true });

  if (!updated) {
    req.flash("error", "Family not found");
    return res.redirect("/families");
  }

  req.flash("success", "Family updated successfully");
  res.redirect(`/families/${id}`);
});

router.delete("/:id", isLoggedIn, async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    req.flash("error", "Family not found");
    return res.redirect("/families");
  }

  await Family.findByIdAndDelete(id);
  req.flash("success", "Family deleted successfully");
  res.redirect("/families");
});

module.exports = router;
