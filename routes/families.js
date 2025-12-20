// routes/families.js
const express = require("express");
const router = express.Router();
const Family = require("../models/family.js");

// ------------FAMILY ROUTES------------

// Create Family
router.get("/new", async (req, res) => {
    res.render("villages/create-family.ejs");
});

router.post("/", async (req, res) => {
    let newFamily = new Family(req.body);   
    let savedFamily = await newFamily.save();
    res.redirect(`/families/${savedFamily._id}`);
});

// Read All Families
router.get("/", async (req, res) => {
    let families = await Family.find({});
    res.render("villages/families.ejs", { families });
});

// Read Single Family
router.get("/:id", async (req, res) => {
    let { id } = req.params;
    let family = await Family.findById(id);
    res.render("villages/family-info.ejs", { family });
});

// Update Family
router.get("/:id/edit", async (req, res) => {
    let { id } = req.params;
    let family = await Family.findById(id);
    if (!family) {
        return res.status(404).send("Family not found!");
    }
    res.render("villages/edit-family.ejs", { family });
});

router.put("/:id", async (req, res) => {
    let { id } = req.params;
    let updated = await Family.findByIdAndUpdate(id, req.body, { new: true });
    res.redirect(`/families/${id}`);
});

// Delete Family
router.delete("/:id", async (req, res) => {
    let { id } = req.params;
    await Family.findByIdAndDelete(id);
    res.redirect("/families");
});

module.exports = router;
