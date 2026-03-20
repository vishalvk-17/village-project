function isLoggedIn(req, res, next) {
  if (req.session && req.session.user) return next();
  return res.redirect("/login");
}

function requireDatabase(req, res, next) {
  if (req.app.locals.isMongoConnected) return next();

  req.flash("error", "Database connection is temporarily unavailable. Please try again in a moment.");
  return res.redirect("/");
}

function isOwnerOrAdmin(req, res, next) {
  const user = req.session.user;
  if (!user) return res.redirect("/login");
  if (user.role === "admin" || user.id === req.params.id) return next();
  return res.status(403).send("Forbidden");
}

function isAdmin(req, res, next) {
  const user = req.session.user;
  if (!user) return res.redirect("/login");
  if (user.role === "admin") return next();
  return res.status(403).send("Only admin can do this action");
}

module.exports = { isLoggedIn, isOwnerOrAdmin, isAdmin, requireDatabase };
