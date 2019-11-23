const passport = require("passport");

// ---------auth controllers---------
exports.postLogin = passport.authenticate("login", {
  successRedirect: "/",
  failureRedirect: "/auth/login",
  failureFlash: true
});

