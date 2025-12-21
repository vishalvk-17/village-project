const express = require("express");
const app = express();
const port = process.env.Port || 8080;
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const path = require("path");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");

// Routes
const villagerRoutes = require("./routes/villagers");
const familyRoutes = require("./routes/families");
const pageRoutes = require("./routes/navbar.js");
const authRoutes = require("./routes/auth");

// View engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);

// Middleware
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// ----- Session & Flash -----
app.use(
  session({
    secret: process.env.SESSION_SECRET || "replace_this_with_a_strong_secret",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URL,
      collectionName: "sessions"
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 // 1 day
    }
  })
);
app.use(flash());

// Make current user and flash messages available to all templates
app.use((req, res, next) => {
  res.locals.currentUser = req.session.user || null;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

// Routes
app.use("/", pageRoutes);       // About, Community
app.use("/", authRoutes);       // Login, Logout
app.use("/", villagerRoutes);
app.use("/families", familyRoutes);

// Home route
app.get("/", (req, res) => {
  res.render("villages/home.ejs", { showHero: true });
});

// Database connection
mongoose.connect(process.env.MONGODB_URL)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));


// Start server
app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
