const express = require("express");
const auth = require('../conf/auth');
const restController = require("../controllers/restController");
const router = express.Router();

router.post("/logout", auth.ensureAuthenticated, restController.postSignOut);

module.exports = router;