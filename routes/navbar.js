// routes/pages.js
const express = require("express");
const router = express.Router();

const temples = [
  {
    name: "Radha Krishna Mandir",
    description: "Gaon ka ek mukhya aastha sthal jahan utsav aur bhajan karyakram regularly hote hain.",
    image: "https://images.unsplash.com/photo-1598091383021-15ddea10925d?q=80&w=1170&auto=format&fit=crop"
  },
  {
    name: "Hanuman Mandir",
    description: "Mangal aur Shanivar ke din yahan vishesh pooja aur samudaayik bhakti karyakram hota hai.",
    image: "https://images.unsplash.com/photo-1627894483216-2138af692e32?q=80&w=1170&auto=format&fit=crop"
  },
  {
    name: "Shiv Mandir",
    description: "Parampara aur shanti ka prateek, yeh mandir gaon ke logon ko ek saath laata hai.",
    image: "https://images.unsplash.com/photo-1561361058-c24cecae35ca?q=80&w=1170&auto=format&fit=crop"
  }
];

const panchayatHighlights = [
  "Jan seva, certificates aur village-level administration ke liye kendriya sthaan.",
  "Gaon ke vikas, safai, pani aur sadak sambandhi faislon ka primary office.",
  "Public communication aur local governance ko streamline karne ka mukhya kendra."
];

const schools = [
  {
    name: "Government Primary School",
    level: "Primary Education",
    description: "Gaon ke bachchon ke liye buniyadi shiksha aur daily learning environment."
  },
  {
    name: "Middle School",
    level: "Middle Section",
    description: "Higher classes ke students ke liye structured academics aur co-curricular support."
  },
  {
    name: "Nearby Senior Secondary School",
    level: "Senior Classes",
    description: "Board classes aur future studies ke liye nearest advanced learning option."
  }
];

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

router.get("/temples", (req, res) => {
  res.render("villages/temples.ejs", { temples });
});

router.get("/gram-panchayat", (req, res) => {
  res.render("villages/gram-panchayat.ejs", { panchayatHighlights });
});

router.get("/schools", (req, res) => {
  res.render("villages/schools.ejs", { schools });
});

module.exports = router;
