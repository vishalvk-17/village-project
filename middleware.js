// --------- Middleware — authorization helpers --------->

function isLoggedIn(req, res, next) {
  if (req.session && req.session.user) return next();
  return res.redirect("/login");
}

function isOwnerOrAdmin(req, res, next) {
  const user = req.session.user;
  if (!user) return res.redirect("/login");
  if (user.role === "admin" || user.id === req.params.id) return next();
  return res.status(403).send("Forbidden");
}

// ✅ Export functions
module.exports = { isLoggedIn, isOwnerOrAdmin };
