const fs = require("fs");
const path = require("path");
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");

const envPath = path.join(__dirname, ".env");
if (fs.existsSync(envPath)) {
  const envLines = fs.readFileSync(envPath, "utf8").split(/\r?\n/);
  for (const line of envLines) {
    const trimmedLine = line.trim();
    if (!trimmedLine || trimmedLine.startsWith("#")) continue;

    const separatorIndex = trimmedLine.indexOf("=");
    if (separatorIndex === -1) continue;

    const key = trimmedLine.slice(0, separatorIndex).trim();
    const value = trimmedLine.slice(separatorIndex + 1).trim().replace(/^['"]|['"]$/g, "");

    if (key && process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

const port = process.env.PORT || 8080;

// Routes
const villagerRoutes = require("./routes/villagers");
const familyRoutes = require("./routes/families");
const pageRoutes = require("./routes/navbar.js");
const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
const Notice = require("./models/notice");
const Star = require("./models/star");

let isMongoConnected = false;
app.locals.isMongoConnected = false;

// View engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);

// Middleware
app.use(express.static(path.join(__dirname, "public")));
app.get("/favicon.ico", (req, res) => res.status(204).end());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// ----- Session & Flash -----
const sessionConfig = {
  secret: process.env.SESSION_SECRET || "replace_this_with_a_strong_secret",
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 // 1 day
  }
};

const sessionStoreUrl = process.env.SESSION_STORE_URL || process.env.MONGODB_URL;

if (sessionStoreUrl) {
  sessionConfig.store = MongoStore.create({
    mongoUrl: sessionStoreUrl,
    collectionName: "sessions"
  });
}

app.use(session(sessionConfig));
app.use(flash());

// Make current user and flash messages available to all templates
app.use((req, res, next) => {
  res.locals.currentUser = req.session.user || null;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.isMongoConnected = req.app.locals.isMongoConnected;
  next();
});

// Routes
app.use("/", pageRoutes);       // About, Community
app.use("/", authRoutes);       // Login, Logout
app.use("/families", familyRoutes);
app.use("/", villagerRoutes);
app.use("/", adminRoutes);

// Home route
app.get("/", async (req, res) => {
  try {
    const notices = isMongoConnected
      ? await Notice.find({}).sort({ createdAt: -1 }).limit(5)
      : [];
    const stars = isMongoConnected
      ? await Star.find({}).sort({ createdAt: -1 }).limit(6)
      : [];

    res.render("villages/home.ejs", { showHero: true, notices, stars });
  } catch (err) {
    console.error("Home page data load failed:", err);
    res.render("villages/home.ejs", { showHero: true, notices: [], stars: [] });
  }
});

// Database connection
mongoose.connect(process.env.MONGODB_URL)
  .then(() => {
    isMongoConnected = true;
    app.locals.isMongoConnected = true;
    console.log("MongoDB connected");
  })
  .catch(err => {
    isMongoConnected = false;
    app.locals.isMongoConnected = false;
    console.log("MongoDB connection failed:", err);
  });


// Start server
app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});

