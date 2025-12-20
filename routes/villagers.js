const express = require("express");
const router = express.Router();
const Villager = require("../models/user.js"); 
const { isLoggedIn, isOwnerOrAdmin } = require("../middleware");
const upload = require("../utils/multer.js");
const User = require("../models/user.js");
const bcrypt = require("bcrypt");


// Show all villagers
router.get("/villagers", async (req, res) => {
  try {
    const users = await User.find({});
    res.render("villages/show.ejs", { users });
  } catch (err) {
    console.error(err);
    req.flash("error", "Failed to fetch villagers");
    res.redirect("/");
  }
});



// resister
router.get("/register", (req, res)=>{
  res.render("villages/index.ejs")
});

router.post("/register", upload.single("image"), async (req, res) => {
  try {
    let userData = { ...req.body };

    if (req.file) {
      userData.image = req.file.filename;
    }

    // ✅ password hash karna
    const saltRounds = 10;
    userData.password = await bcrypt.hash(req.body.password, saltRounds);

    let user = new User(userData);
    await user.save();

    req.flash("success", "Registration successful! Please login.");
    res.redirect("/login");
  } catch (err) {
    console.error(err);
    req.flash("error", "Failed to register user");
    res.redirect("/register");
  }
});



// READ (show villager profile)
router.get("/:id", async (req, res) => {
  let { id } = req.params;
  let user = await User.findById(id);
  if (!user) {
    req.flash("error", "Villager not found");
    return res.redirect("/villagers");
  }
  res.render("villages/user-info", { user });
});

// EDIT form
router.get("/:id/edit", isLoggedIn, isOwnerOrAdmin, async (req, res) => {
  let { id } = req.params;
  let user = await User.findById(id);
  if (!user) {
    req.flash("error", "Villager not found");
    return res.redirect("/villagers");
  }
  res.render("villages/edit", { user });
});

// UPDATE
router.put("/:id", isLoggedIn, isOwnerOrAdmin, upload.single("image"), async (req, res) => {
  let { id } = req.params;
  let updatedData = { ...req.body };
  if (req.file) updatedData.image = req.file.filename;

  let user = await User.findByIdAndUpdate(id, updatedData, { new: true });
  req.flash("success", "Your profile has been updated successfully");
  res.redirect(`/${user._id}`);
});

// DELETE
router.delete("/:id", isLoggedIn, isOwnerOrAdmin, async (req, res) => {
  try {
    let { id } = req.params;
    await User.findByIdAndDelete(id);

    // अगर villager खुद को delete कर रहा है
    if (req.session.user && req.session.user.id === id) {
      req.session.destroy(err => {
        if (err) {
          console.error(err);
          return res.status(500).send("Error ending session");
        }
        res.redirect("/");
      });
    } else {
      // अगर admin ने किसी और का account delete किया
      req.flash("success", "Villager profile deleted successfully");
      res.redirect("/villagers"); 
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error during deletion");
  }
});




module.exports = router;