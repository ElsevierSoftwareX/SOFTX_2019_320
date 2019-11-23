// Authentication method.
exports.ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.redirect("/auth/login");
    }
};

// Authorization method.
exports.ensureAuthorized = (req, res, next) => {
    if (req.user.role === 'admin') {
        next();
    } else {
        req.flash("error", "You are not authorized.");
        res.redirect("/");
    }
  };
