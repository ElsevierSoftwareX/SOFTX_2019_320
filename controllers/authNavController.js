// ---------login page---------
exports.getLogin = (req, res, next) => {
  res.render("auth/login", {year: new Date().getFullYear()});
};
