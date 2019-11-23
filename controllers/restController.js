exports.postSignOut = (req, res) => {
  req.logout();
  return res.send('logout');
};
