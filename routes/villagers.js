const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { isLoggedIn, isOwnerOrAdmin, isAdmin } = require("../middleware");
const upload = require("../utils/multer.js");
const User = require("../models/user.js");
const bcrypt = require("bcrypt");

function saveImageInDatabase(userData, file) {
  if (!file) return;

  userData.imageData = file.buffer.toString("base64");
  userData.imageType = file.mimetype;
}

function getPublicApprovalFilter() {
  return {
    $or: [
      { isApproved: true },
      { isApproved: { $exists: false } }
    ]
  };
}

function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

router.get("/villagers", async (req, res) => {
  try {
    const search = req.query.search?.trim() || "";
    const profession = req.query.profession?.trim() || "";
    const currentUser = req.session.user;
    const filters = {};

    if (!currentUser || currentUser.role !== "admin") {
      Object.assign(filters, getPublicApprovalFilter());
    }

    if (search) {
      filters.$or = [
        { name: { $regex: search, $options: "i" } },
        { village: { $regex: search, $options: "i" } },
        { profession: { $regex: search, $options: "i" } }
      ];
    }

    if (profession) {
      filters.profession = profession;
    }

    const professionFilters = (!currentUser || currentUser.role !== "admin") ? getPublicApprovalFilter() : {};
    const users = await User.find(filters).sort({ createdAt: -1 });
    const professions = await User.distinct("profession", professionFilters);

    res.render("villages/show.ejs", { users, search, profession, professions });
  } catch (err) {
    console.error(err);
    req.flash("error", "Failed to fetch villagers");
    res.redirect("/");
  }
});

router.get("/register", (req, res) => {
  res.render("villages/index.ejs");
});

router.post("/register", upload.single("image"), async (req, res) => {
  try {
    const userData = { ...req.body };
    userData.phone = userData.phone?.trim();
    userData.village = userData.village?.trim() || "Bhilkheda";
    userData.profession = userData.profession?.trim();
    userData.education = userData.education?.trim();
    userData.about = userData.about?.trim();
    userData.isApproved = false;

    if (req.file) {
      saveImageInDatabase(userData, req.file);
    }

    userData.password = await bcrypt.hash(req.body.password, 10);

    const user = new User(userData);
    await user.save();

    req.flash("success", "Registration successful! Please login. Your profile will appear after admin approval.");
    res.redirect("/login");
  } catch (err) {
    console.error(err);
    req.flash("error", "Failed to register user");
    res.redirect("/register");
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    req.flash("error", "Villager not found");
    return res.redirect("/villagers");
  }

  const user = await User.findById(id);

  if (!user) {
    req.flash("error", "Villager not found");
    return res.redirect("/villagers");
  }

  const viewer = req.session.user;
  const canViewPendingProfile = viewer && (viewer.role === "admin" || viewer.id === user._id.toString());

  if (user.isApproved === false && !canViewPendingProfile) {
    req.flash("error", "This villager profile is waiting for admin approval");
    return res.redirect("/villagers");
  }

  res.render("villages/user-info", { user });
});

router.get("/:id/edit", isLoggedIn, isOwnerOrAdmin, async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    req.flash("error", "Villager not found");
    return res.redirect("/villagers");
  }

  const user = await User.findById(id);

  if (!user) {
    req.flash("error", "Villager not found");
    return res.redirect("/villagers");
  }

  res.render("villages/edit", { user });
});

router.put("/:id", isLoggedIn, isOwnerOrAdmin, upload.single("image"), async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    req.flash("error", "Villager not found");
    return res.redirect("/villagers");
  }

  const updatedData = { ...req.body };
  updatedData.phone = updatedData.phone?.trim();
  updatedData.village = updatedData.village?.trim() || "Bhilkheda";
  updatedData.profession = updatedData.profession?.trim();
  updatedData.education = updatedData.education?.trim();
  updatedData.about = updatedData.about?.trim();

  if (req.file) {
    saveImageInDatabase(updatedData, req.file);
  }

  if (updatedData.password) {
    updatedData.password = await bcrypt.hash(updatedData.password, 10);
  } else {
    delete updatedData.password;
  }

  if (req.session.user.role !== "admin") {
    updatedData.isApproved = false;
  }

  const user = await User.findByIdAndUpdate(id, updatedData, { new: true });
  req.flash("success", "Your profile has been updated successfully");
  res.redirect(`/${user._id}`);
});

router.post("/:id/approve", isLoggedIn, isAdmin, async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    req.flash("error", "Villager not found");
    return res.redirect("/villagers");
  }

  await User.findByIdAndUpdate(id, { isApproved: true });
  req.flash("success", "Villager profile approved successfully");
  res.redirect(`/${id}`);
});

router.delete("/:id", isLoggedIn, isOwnerOrAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      req.flash("error", "Villager not found");
      return res.redirect("/villagers");
    }

    await User.findByIdAndDelete(id);

    if (req.session.user && req.session.user.id === id) {
      req.session.destroy(err => {
        if (err) {
          console.error(err);
          return res.status(500).send("Error ending session");
        }
        res.redirect("/");
      });
    } else {
      req.flash("success", "Villager profile deleted successfully");
      res.redirect("/villagers");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error during deletion");
  }
});

module.exports = router;
