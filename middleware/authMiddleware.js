module.exports = {
  ensureAuthenticated: function (req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    // Jika belum login, redirect ke halaman login
    res.redirect("/auth/login");
  },
};
